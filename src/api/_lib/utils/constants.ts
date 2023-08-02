import { get } from '@vercel/edge-config';

export enum CheckedEvent {
	CommitComment = 'commit_comment',
	IssueComment = 'issue_comment',
	Issues = 'issues',
	PullRequest = 'pull_request',
	PullRequestReview = 'pull_request_review',
	PullRequestReviewComment = 'pull_request_review_comment',
	PullRequestReviewThread = 'pull_request_review_thread',
	Push = 'push',
	Release = 'release',
	TagOrBranchCreate = 'create',
	TagOrBranchDelete = 'delete',
}

export enum FilterCheckedEvent {
	CommitComment = 'commit_comment',
	IssueComment = 'issue_comment',
	Issues = 'issues',
	PullRequest = 'pull_request',
	PullRequestReview = 'pull_request_review',
	PullRequestReviewComment = 'pull_request_review_comment',
	PullRequestReviewThread = 'pull_request_review_thread',
}

export interface EdgeConfig {
	channelIds?: {
		apps?: Record<string, string>;
		monorepo?: string;
		packages?: Record<string, string>;
	};
	discard?: {
		codecov?: DiscardCommentTypes;
		githubActions?: DiscardCommentTypes;
		vercel?: DiscardCommentTypes;
	};
	overrideWebhooks?: Record<string, string>;
}
export interface DiscardCommentTypes {
	commitComments?: boolean;
	prComments?: boolean;
}

const discard = await get<EdgeConfig['discard']>('discard');

export const DiscardVercelPrComments = discard?.vercel?.prComments === true;
export const DiscardVercelCommitComments = discard?.vercel?.commitComments === true;
export const VercelBotId = 35_613_825;
export const DiscardCodecovPrComments = discard?.codecov?.prComments === true;
export const DiscardCodecovCommitComments = discard?.codecov?.commitComments === true;
export const CodecovBotId = 22_429_695;
export const DiscardGithubActionsPrComments = discard?.githubActions?.prComments === true;
export const DiscardGithubActionsCommitComments = discard?.githubActions?.commitComments === true;
export const GithubActionsBotId = 41_898_282;
