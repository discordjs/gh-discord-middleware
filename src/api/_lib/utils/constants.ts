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
	Push = 'push',
	TagOrBranchCreate = 'create',
	TagOrBranchDelete = 'delete',
}

export interface EdgeConfig {
	channelIds?: {
		apps?: Record<string, string>;
		monorepo?: string;
		packages?: Record<string, string>;
	};
	debugLogs?: boolean;
	discard?: {
		codecov?: DiscardTypes;
		githubActions?: DiscardTypes;
		renovate?: DiscardTypes;
		vercel?: DiscardTypes;
	};
	overrideWebhooks?: {
		apps?: Record<string, string>;
		packages?: Record<string, string>;
	};
}
export interface DiscardTypes {
	commitComments?: boolean;
	prComments?: boolean;
	push?: boolean;
	tagOrBranch?: boolean;
}

export const discardConfig = await get<EdgeConfig['discard']>('discard');
export const discardConfigEntries = discardConfig
	? (Object.entries(discardConfig) as [keyof NonNullable<EdgeConfig['discard']>, Readonly<DiscardTypes>][])
	: [];

export const botIds: Record<keyof NonNullable<EdgeConfig['discard']>, number> = {
	codecov: 22_429_695,
	githubActions: 41_898_282,
	renovate: 29_139_614,
	vercel: 35_613_825,
};
