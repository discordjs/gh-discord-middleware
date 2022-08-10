import type {
	CommitCommentEvent,
	IssueCommentEvent,
	IssuesEvent,
	PullRequestEvent,
	PullRequestReviewCommentEvent,
	PullRequestReviewEvent,
	PullRequestReviewThreadEvent,
} from '@octokit/webhooks-types';
import {
	CodecovBotId,
	DiscardCodecovComments,
	DiscardVercelPrComments,
	DiscardVercelCommitComments,
	VercelBotId,
} from '../utils/constants.js';

export function filterPrComments(
	event:
		| IssueCommentEvent
		| IssuesEvent
		| PullRequestEvent
		| PullRequestReviewCommentEvent
		| PullRequestReviewEvent
		| PullRequestReviewThreadEvent,
): boolean {
	if (DiscardCodecovComments && event.sender.id === CodecovBotId) return true;
	if (DiscardVercelPrComments && event.sender.id === VercelBotId) return true;
	return false;
}

export function filterCommitComments(event: CommitCommentEvent): boolean {
	if (DiscardCodecovComments && event.comment.user.id === CodecovBotId) return true;
	if (DiscardVercelCommitComments && event.comment.user.id === VercelBotId) return true;
	return false;
}
