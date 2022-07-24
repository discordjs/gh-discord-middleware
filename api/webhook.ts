import { RequestError } from '@octokit/request-error';
import type {
	CommitCommentEvent,
	IssueCommentEvent,
	IssuesEvent,
	PullRequestEvent,
	PullRequestReviewCommentEvent,
	PullRequestReviewEvent,
	PullRequestReviewThreadEvent,
	PushEvent,
	ReleaseEvent,
} from '@octokit/webhooks-types';
import { CheckedEvent } from '../lib/constants';
import { enumIncludes } from '../lib/functions';
import { getCommitCommentRewriteTarget } from '../lib/handlers/commitComment';
import { getIssueRewriteTarget } from '../lib/handlers/issues';
import { getPullRequestRewriteTarget } from '../lib/handlers/pullRequest';
import { getPushRewriteTarget } from '../lib/handlers/push';
import { getReleaseRewriteTarget } from '../lib/handlers/release';
import { type DiscordWebhooksTarget, DiscordWebhooks } from '../lib/webhooks';

export const config = {
	runtime: 'experimental-edge',
};

function rewrite(target: Exclude<DiscordWebhooksTarget, 'none'>) {
	let url = DiscordWebhooks[target];
	if (!url && target !== 'monorepo') {
		url = DiscordWebhooks.monorepo;
	}
	if (!url)
		return new Response(null, {
			status: 500,
			statusText: 'Cannot process request due to missing server side keys',
		});

	return new Response(null, { headers: new Headers({ 'x-middleware-rewrite': url }) });
}

export default async function handler(req: Request) {
	const eventName = req.headers.get('X-GitHub-Event');
	if (!eventName) {
		return new Response(null, { status: 400, statusText: 'Not a github event' });
	}
	if (!eventName || !enumIncludes(CheckedEvent, eventName)) return rewrite('monorepo');

	const eventData = (await req.json()) as unknown;
	let target: DiscordWebhooksTarget;
	try {
		switch (eventName) {
			case CheckedEvent.CommitComment:
				target = await getCommitCommentRewriteTarget(eventData as CommitCommentEvent);
				break;
			case CheckedEvent.IssueComment:
			case CheckedEvent.Issues:
				target = getIssueRewriteTarget(eventData as IssueCommentEvent | IssuesEvent);
				break;
			case CheckedEvent.PullRequest:
			case CheckedEvent.PullRequestReview:
			case CheckedEvent.PullRequestReviewComment:
			case CheckedEvent.PullRequestReviewThread:
				target = await getPullRequestRewriteTarget(
					eventData as
						| PullRequestEvent
						| PullRequestReviewEvent
						| PullRequestReviewCommentEvent
						| PullRequestReviewThreadEvent,
				);
				break;
			case CheckedEvent.Push:
				target = getPushRewriteTarget(eventData as PushEvent);
				break;
			case CheckedEvent.Release:
				target = getReleaseRewriteTarget(eventData as ReleaseEvent);
				break;
		}
	} catch (err) {
		// Github request errored in some way
		if (err instanceof RequestError) {
			if (err.status === 404) {
				return rewrite('monorepo');
			}
			const headers: HeadersInit = {
				'content-type': 'application/json',
			};
			if (err.response) {
				const limit = err.response.headers['x-ratelimit-limit'];
				if (limit) headers['x-ratelimit-limit'] = limit;
				const remaining = err.response.headers['x-ratelimit-remaining'];
				if (remaining) headers['x-ratelimit-remaining'] = remaining;
				const reset = err.response.headers['x-ratelimit-reset'];
				if (reset) headers['x-ratelimit-reset'] = reset;
			}
			return new Response(JSON.stringify(err), {
				headers,
				status: err.status === 429 ? 429 : 500,
				statusText: 'An error occured in an upstream fetch request',
			});
		}

		// Some other error occured, we don't know what it is
		return new Response(JSON.stringify(err), {
			status: 500,
			statusText: 'An unexpected error occured while processing the event',
			headers: { 'content-type': 'application/json' },
		});
	}

	if (target === 'none') {
		return new Response(null, { status: 204, statusText: 'Event recieved, skipped forwarding' });
	}

	return rewrite(target);
}
