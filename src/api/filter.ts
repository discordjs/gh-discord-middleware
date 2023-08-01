import { STATUS_CODES } from 'node:http';
import type {
	CommitCommentEvent,
	IssueCommentEvent,
	IssuesEvent,
	PullRequestEvent,
	PullRequestReviewCommentEvent,
	PullRequestReviewEvent,
	PullRequestReviewThreadEvent,
	WebhookEvent,
} from '@octokit/webhooks-types';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { type Dispatcher, request } from 'undici';
import { FilterCheckedEvent } from './_lib/utils/constants.js';
import { filterCommitComments, filterPrComments } from './_lib/utils/filters.js';
import { enumIncludes } from './_lib/utils/functions.js';

function respondJSON(res: VercelResponse, status: number, message: string, data: unknown) {
	res.status(status).json({ status, message, data });
}

async function rewrite(req: VercelRequest, res: VercelResponse, target: string) {
	const originalBody = req.body as WebhookEvent;

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

		const discordRes = await request(target, {
			body,
			headers,
			method: req.method as Dispatcher.HttpMethod | undefined,
		});
		res.writeHead(discordRes.statusCode, STATUS_CODES[discordRes.statusCode], discordRes.headers);
		discordRes.body?.pipe(res);
	} catch (error) {
		respondJSON(res, 500, `Error while forwarding request to discord`, error);
	}
}

function skip(res: VercelResponse) {
	res.writeHead(204).end('Event received, skipped forwarding');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const rewriteUrl = req.query.url;

	if (!rewriteUrl || Array.isArray(rewriteUrl)) {
		res.writeHead(400).end('url must be specified exactly once');
		return;
	}

	const eventName = req.headers['x-github-event'];
	if (!eventName || !req.headers['content-type']?.includes('json')) {
		res.writeHead(400).end('Not a github event');
		return;
	}

	if (!eventName || !enumIncludes(FilterCheckedEvent, eventName)) return rewrite(req, res, rewriteUrl);

	const eventData = req.body as WebhookEvent;
	try {
		switch (eventName) {
			case FilterCheckedEvent.CommitComment:
				if (filterCommitComments(eventData as CommitCommentEvent)) {
					skip(res);
					return;
				}

				break;
			case FilterCheckedEvent.IssueComment:
			case FilterCheckedEvent.Issues:
			case FilterCheckedEvent.PullRequest:
			case FilterCheckedEvent.PullRequestReview:
			case FilterCheckedEvent.PullRequestReviewComment:
			case FilterCheckedEvent.PullRequestReviewThread:
				if (
					filterPrComments(
						eventData as
							| IssueCommentEvent
							| IssuesEvent
							| PullRequestEvent
							| PullRequestReviewCommentEvent
							| PullRequestReviewEvent
							| PullRequestReviewThreadEvent,
					)
				) {
					skip(res);
					return;
				}

				break;
		}
	} catch (error) {
		// Some other error occurred, we don't know what it is
		respondJSON(res, 500, 'An unexpected error occurred while processing the event', error);
		return;
	}

	await rewrite(req, res, rewriteUrl);
}
