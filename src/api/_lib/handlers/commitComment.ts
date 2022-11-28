import { request } from '@octokit/request';
import type { CommitCommentEvent } from '@octokit/webhooks-types';
import { filterCommitComments } from '../utils/filters.js';
import { getTargetFromFiles } from '../utils/functions.js';
import type { DiscordWebhooksTarget } from '../utils/webhooks.js';

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

	return getTargetFromFiles(commit.files);
}
