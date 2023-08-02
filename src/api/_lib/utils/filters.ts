/* eslint-disable sonarjs/prefer-single-boolean-return */
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
	DiscardCodecovPrComments,
	DiscardCodecovCommitComments,
	DiscardVercelPrComments,
	DiscardVercelCommitComments,
	VercelBotId,
	GithubActionsBotId,
	DiscardGithubActionsPrComments,
	DiscardGithubActionsCommitComments,
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
	if (DiscardCodecovPrComments && event.sender.id === CodecovBotId) return true;
	if (DiscardVercelPrComments && event.sender.id === VercelBotId) return true;
	if (DiscardGithubActionsPrComments && event.sender.id === GithubActionsBotId) return true;
	return false;
}

export function filterCommitComments(event: CommitCommentEvent): boolean {
	if (DiscardCodecovCommitComments && event.comment.user.id === CodecovBotId) return true;
	if (DiscardVercelCommitComments && event.comment.user.id === VercelBotId) return true;
	if (DiscardGithubActionsCommitComments && event.comment.user.id === GithubActionsBotId) return true;
	return false;
}
