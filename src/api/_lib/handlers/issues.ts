import type { IssueCommentEvent, IssuesEvent } from '@octokit/webhooks-types';
import { filterPrComments } from '../utils/filters.js';
import { getLabelTarget, getPotentialTarget } from '../utils/functions.js';
import type { DiscordWebhooksTarget } from '../utils/webhooks.js';

/**
 * Gets the target for incoming issue type webhooks
 *
 * @param event - The event data
 * @returns The target name
 */
export function getIssueRewriteTarget(event: IssueCommentEvent | IssuesEvent): DiscordWebhooksTarget {
	if (filterPrComments(event)) return 'none';

	const label = getLabelTarget(event.issue.labels);
	if (label) return label;

	if (!event.issue.body) return 'monorepo';

	const splitBody = event.issue.body.split('\n');

	if (!splitBody[0]?.includes('Which package is')) return 'monorepo';

	const potentialPackage = splitBody[2];
	if (!potentialPackage) return 'monorepo';
	return getPotentialTarget(potentialPackage);
}
