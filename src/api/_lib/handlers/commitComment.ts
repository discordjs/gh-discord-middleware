import { request } from '@octokit/request';
import type { CommitCommentEvent } from '@octokit/webhooks-types';
import { PackageName } from '../utils/constants.js';
import { filterCommitComments } from '../utils/filters.js';
import { DiscordWebhooksTarget, PerPackageWebhooks } from '../utils/webhooks.js';

/**
 * Gets the target for incoming commit comment type webhooks
 * @param event The event data
 * @returns The target name
 */
export async function getCommitCommentRewriteTarget(event: CommitCommentEvent): Promise<DiscordWebhooksTarget> {
	if (filterCommitComments(event)) return 'none';

	const commitResponse = await request('GET /repos/{owner}/{repo}/commits/{ref}', {
		owner: event.repository.owner.login,
		repo: event.repository.name,
		ref: event.comment.commit_id,
	});

	const commit = commitResponse.data;

	let singlePackage: PackageName | null = null;

	for (const name of Object.values(PackageName)) {
		if (commit.files?.some((file) => file.filename.startsWith(`packages/${name}/`))) {
			if (singlePackage) return 'monorepo';
			singlePackage = name;
		}
	}

	if (!singlePackage) return 'monorepo';
	return PerPackageWebhooks[singlePackage];
}
