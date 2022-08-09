import type { IssueCommentEvent, IssuesEvent } from '@octokit/webhooks-types';
import { CodecovBotId, DiscardCodecovComments, DiscardVercelPrComments, VercelBotId } from '../utils/constants.js';
import { getPackageLabelTarget, getPotentialPackageTarget } from '../utils/functions.js';
import type { DiscordWebhooksTarget } from '../utils/webhooks.js';

/**
 * Gets the target for incoming issue type webhooks
 * @param event The event data
 * @returns The target name
 */
export function getIssueRewriteTarget(event: IssueCommentEvent | IssuesEvent): DiscordWebhooksTarget {
	if (DiscardCodecovComments && event.sender.id === CodecovBotId) return 'none';
	if (DiscardVercelPrComments && event.sender.id === VercelBotId) return 'none';

	const packageLabel = getPackageLabelTarget(event.issue.labels);
	if (packageLabel) return packageLabel;

	if (!event.issue.body) return 'monorepo';

	const splitBody = event.issue.body.split('\n');

	if (!splitBody[0]?.includes('Which package is')) return 'monorepo';

	const potentialPackage = splitBody[2];
	if (!potentialPackage) return 'monorepo';
	return getPotentialPackageTarget(potentialPackage);
}
