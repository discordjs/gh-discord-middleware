import { request } from '@octokit/request';
import type {
	PullRequestEvent,
	PullRequestReviewCommentEvent,
	PullRequestReviewEvent,
	PullRequestReviewThreadEvent,
} from '@octokit/webhooks-types';
import {
	CodecovBotId,
	DiscardCodecovComments,
	DiscardVercelPrComments,
	PackageName,
	VercelBotId,
} from '../utils/constants';
import { DiscordWebhooksTarget, PerPackageWebhooks } from '../utils/webhooks';

/**
 * Gets the target for incoming pull request and subsidary type webhooks
 * @param event The event data
 * @returns The target name
 */
export async function getPullRequestRewriteTarget(
	event: PullRequestEvent | PullRequestReviewEvent | PullRequestReviewCommentEvent | PullRequestReviewThreadEvent,
): Promise<DiscordWebhooksTarget> {
	if (DiscardCodecovComments && event.sender.id === CodecovBotId) return 'none';
	if (DiscardVercelPrComments && event.sender.id === VercelBotId) return 'none';

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
