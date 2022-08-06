import { request } from '@octokit/request';
import type { CommitCommentEvent } from '@octokit/webhooks-types';
import {
	CodecovBotId,
	DiscardCodecovComments,
	DiscardVercelCommitComments,
	PackageName,
	VercelBotId,
} from '../utils/constants.js';
import { DiscordWebhooksTarget, PerPackageWebhooks } from '../utils/webhooks.js';

/**
 * Gets the target for incoming commit comment type webhooks
 * @param event The event data
 * @returns The target name
 */
export async function getCommitCommentRewriteTarget(event: CommitCommentEvent): Promise<DiscordWebhooksTarget> {
	if (DiscardCodecovComments && event.comment.user.id === CodecovBotId) return 'none';
	if (DiscardVercelCommitComments && event.comment.user.id === VercelBotId) return 'none';

	const commitResponse = await request('GET /repos/{owner}/{repo}/commits/{ref}', {
		owner: event.repository.owner.login,
		repo: event.repository.name,
		ref: event.comment.commit_id,
	});

	const commit = commitResponse.data;

	let singlePackage: PackageName | null = null;

	for (const name of Object.values(PackageName)) {
		if (commit.files?.some((file) => file.filename.startsWith(`packages/${name}`))) {
			if (singlePackage) return 'monorepo';
			singlePackage = name;
		}
	}

	if (!singlePackage) return 'monorepo';
	return PerPackageWebhooks[singlePackage];
}
