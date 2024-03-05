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
} from '@octokit/webhooks-types';
import type { DiscardTypes } from './constants.js';
import { botIds, discardConfigEntries } from './constants.js';

function filter(checkId: number, type: keyof DiscardTypes) {
	for (const [bot, discard] of discardConfigEntries) {
		const botId = botIds[bot];
		if (discard?.[type] === true && checkId === botId) return true;
	}

	return false;
}

export function filterPrComments(
	event:
		| IssueCommentEvent
		| IssuesEvent
		| PullRequestEvent
		| PullRequestReviewCommentEvent
		| PullRequestReviewEvent
		| PullRequestReviewThreadEvent,
): boolean {
	return filter(event.sender.id, 'prComments');
}

export function filterCommitComments(event: CommitCommentEvent): boolean {
	return filter(event.comment.user.id, 'commitComments');
}

export function filterPushes(event: PushEvent): boolean {
	return filter(event.sender.id, 'push');
}

export function filterTagOrBranches(event: CreateEvent | DeleteEvent): boolean {
	// Since it is not possible to get the creator of the tag / branch without an extra request, sender is best effort.
	return filter(event.sender.id, 'tagOrBranch');
}
