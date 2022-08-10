import { request } from '@octokit/request';
import type {
	PullRequestEvent,
	PullRequestReviewCommentEvent,
	PullRequestReviewEvent,
	PullRequestReviewThreadEvent,
} from '@octokit/webhooks-types';
import { PackageName } from '../utils/constants.js';
import { filterPrComments } from '../utils/filters.js';
import { getPackageLabelTarget } from '../utils/functions.js';
import { DiscordWebhooksTarget, PerPackageWebhooks } from '../utils/webhooks.js';

/**
 * Gets the target for incoming pull request and subsidary type webhooks
 * @param event The event data
 * @returns The target name
 */
export async function getPullRequestRewriteTarget(
	event: PullRequestEvent | PullRequestReviewEvent | PullRequestReviewCommentEvent | PullRequestReviewThreadEvent,
): Promise<DiscordWebhooksTarget> {
	if (filterPrComments(event)) return 'none';

	// Workaround for pre-monorepo
	if (event.pull_request.base.ref === 'v13') return 'discord.js';

	const packageLabel = getPackageLabelTarget(event.pull_request.labels);
	if (packageLabel && packageLabel !== 'monorepo') return packageLabel;

	const filesResponse = await request('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', {
		owner: event.repository.owner.login,
		repo: event.repository.name,
		pull_number: event.pull_request.number,
	});

	const files = filesResponse.data;

	let singlePackage: PackageName | null = null;

	for (const name of Object.values(PackageName)) {
		if (files.some((file) => file.filename.startsWith(`packages/${name}`))) {
			if (singlePackage) return 'monorepo';
			singlePackage = name;
		}
	}

	if (!singlePackage) return 'monorepo';
	return PerPackageWebhooks[singlePackage];
}
