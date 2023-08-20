import { STATUS_CODES } from 'node:http';
import { RequestError } from '@octokit/request-error';
import type {
	CommitCommentEvent,
	CreateEvent,
	DeleteEvent,
	IssueCommentEvent,
	IssuesEvent,
	PullRequestEvent,
	PullRequestReviewCommentEvent,
	PullRequestReviewEvent,
	PullRequestReviewThreadEvent,
	PushEvent,
	ReleaseEvent,
	WebhookEvent,
} from '@octokit/webhooks-types';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { request, type Dispatcher } from 'undici';
import { getCommitCommentRewriteTarget } from './_lib/handlers/commitComment.js';
import { getIssueRewriteTarget } from './_lib/handlers/issues.js';
import { getPullRequestRewriteTarget } from './_lib/handlers/pullRequest.js';
import { getPushRewriteTarget } from './_lib/handlers/push.js';
import { getReleaseRewriteTarget } from './_lib/handlers/release.js';
import { getTagOrBranchTarget } from './_lib/handlers/tagOrBranch.js';
import { CheckedEvent } from './_lib/utils/constants.js';
import { enumIncludes } from './_lib/utils/functions.js';
import { DiscordWebhooks } from './_lib/utils/webhooks.js';

function respondJSON(res: VercelResponse, status: number, message: string, data: unknown) {
	res.status(status).json({ status, message, data });
}

async function rewrite(req: VercelRequest, res: VercelResponse, target: string) {
	const originalBody = req.body as WebhookEvent;
	let url = DiscordWebhooks[target];
	if (!url && target !== 'monorepo') {
		url = DiscordWebhooks.monorepo;
		if ('repository' in originalBody && originalBody.repository) {
			originalBody.repository.full_name = `${originalBody.repository.full_name.split('/')[0]!}/${target}`;
		}
	}

	if (!url) {
		res.writeHead(500, 'Cannot process request due to missing server side keys').end();
		return;
	}

	try {
		const body = `${JSON.stringify(originalBody, null, 2)}\n`;
		const headers: Record<string, string> = {};
		if (req.headers.accept) headers.Accept = req.headers.accept;
		if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];
		if (req.headers['user-agent']) headers['User-Agent'] = req.headers['user-agent'];
		if (req.headers['x-github-delivery']) headers['X-Github-Delivery'] = req.headers['x-github-delivery'] as string;
		if (req.headers['x-github-event']) headers['X-GitHub-Event'] = req.headers['x-github-event'] as string;
		if (req.headers['x-github-hook-id']) headers['X-GitHub-Hook-ID'] = req.headers['x-github-hook-id'] as string;
		if (req.headers['x-github-hook-installation-target-id']) {
			headers['X-GitHub-Hook-Installation-Target-ID'] = req.headers['x-github-hook-installation-target-id'] as string;
		}

		if (req.headers['x-github-hook-installation-target-type']) {
			headers['X-GitHub-Hook-Installation-Target-Type'] = req.headers[
				'x-github-hook-installation-target-type'
			] as string;
		}

		const discordRes = await request(url, { body, headers, method: req.method as Dispatcher.HttpMethod | undefined });
		res.writeHead(discordRes.statusCode, STATUS_CODES[discordRes.statusCode], discordRes.headers);
		discordRes.body?.pipe(res);
	} catch (error) {
		respondJSON(res, 500, `Error while forwarding request to discord`, error);
	}
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const eventName = req.headers['x-github-event'];
	if (!eventName || !req.headers['content-type']?.includes('json')) {
		res.writeHead(400).end('Not a github event');
		return;
	}

	if (!eventName || !enumIncludes(CheckedEvent, eventName)) return rewrite(req, res, 'monorepo');

	const eventData = req.body as WebhookEvent;
	let target: string;
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
						| PullRequestReviewCommentEvent
						| PullRequestReviewEvent
						| PullRequestReviewThreadEvent,
				);
				break;
			case CheckedEvent.Push:
				target = getPushRewriteTarget(eventData as PushEvent);
				break;
			case CheckedEvent.Release:
				target = getReleaseRewriteTarget(eventData as ReleaseEvent);
				break;
			case CheckedEvent.TagOrBranchCreate:
			case CheckedEvent.TagOrBranchDelete:
				target = getTagOrBranchTarget(eventData as CreateEvent | DeleteEvent);
				break;
		}
	} catch (error) {
		// Github request errored in some way
		if (error instanceof RequestError) {
			if (error.status === 404) {
				return rewrite(req, res, 'monorepo');
			}

			if (error.response) {
				const limit = error.response.headers['x-ratelimit-limit'];
				if (limit) res.setHeader('x-ratelimit-limit', limit);
				const remaining = error.response.headers['x-ratelimit-remaining'];
				if (remaining) res.setHeader('x-ratelimit-remaining', remaining);
				const reset = error.response.headers['x-ratelimit-reset'];
				if (reset) res.setHeader('x-ratelimit-reset', reset);
			}

			respondJSON(res, error.status === 429 ? 429 : 500, 'An error occurred in an upstream fetch request', error);
			return;
		}

		// Some other error occurred, we don't know what it is
		respondJSON(res, 500, 'An unexpected error occurred while processing the event', error);
		return;
	}

	if (target === 'none') {
		return res.writeHead(204).end('Event received, skipped forwarding');
	}

	await rewrite(req, res, target);
}
