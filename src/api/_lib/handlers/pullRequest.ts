import { request } from '@octokit/request';
import type {
	PullRequestEvent,
	PullRequestReviewCommentEvent,
	PullRequestReviewEvent,
	PullRequestReviewThreadEvent,
} from '@octokit/webhooks-types';
import { filterPrComments } from '../utils/filters.js';
import { getLabelTarget, getTargetFromFiles } from '../utils/functions.js';
import type { DiscordWebhooksTarget } from '../utils/webhooks.js';

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

	const label = getLabelTarget(event.pull_request.labels);
	if (label && label !== 'monorepo') return label;

	const filesResponse = await request('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', {
		owner: event.repository.owner.login,
		repo: event.repository.name,
		pull_number: event.pull_request.number,
	});

	const files = filesResponse.data;

	return getTargetFromFiles(files);
}
