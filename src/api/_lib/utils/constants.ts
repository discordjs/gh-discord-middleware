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

export enum AppName {
	Guide = 'guide',
	Website = 'website',
}

export const AppNameValues = Object.values(AppName);

export enum PackageName {
	Actions = 'actions',
	ApiExtractorUtils = 'api-extractor-utils',
	Brokers = 'brokers',
	Builders = 'builders',
	Collection = 'collection',
	Core = 'core',
	DiscordJS = 'discord.js',
	Docgen = 'docgen',
	Formatters = 'formatters',
	Next = 'next',
	Proxy = 'proxy',
	ProxyContainer = 'proxy-container',
	Rest = 'rest',
	Scripts = 'scripts',
	Sharder = 'sharder',
	Structures = 'structures',
	Ui = 'ui',
	Util = 'util',
	Voice = 'voice',
	Ws = 'ws',
}

export const PackageNameValues = Object.values(PackageName);

export const DiscardVercelPrComments = process.env.DISCARD_VERCEL_PR_COMMENTS === 'true';
export const DiscardVercelCommitComments = process.env.DISCARD_VERCEL_COMMIT_COMMENTS === 'true';
export const VercelBotId = 35613825;
export const DiscardCodecovComments = process.env.DISCARD_CODECOV_COMMENTS === 'true';
export const CodecovBotId = 22429695;
export const DiscardGithubActionsPrComments = process.env.DISCARD_GITHUB_ACTIONS_PR_COMMENTS === 'true';
export const DiscardGithubActionsCommitComments = process.env.DISCARD_GITHUB_ACTIONS_COMMIT_COMMENTS === 'true';
export const GithubActionsBotId = 41898282;
