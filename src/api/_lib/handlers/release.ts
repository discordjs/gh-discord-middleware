import type { ReleaseEvent } from '@octokit/webhooks-types';
import { PackageName } from '../utils/constants.js';
import { getPotentialPackageTarget } from '../utils/functions.js';
import type { DiscordWebhooksTarget } from '../utils/webhooks.js';

/**
 * Gets the target for incoming release type webhooks
 * @param event The event data
 * @returns The target name
 */
export function getReleaseRewriteTarget(event: ReleaseEvent): DiscordWebhooksTarget {
	let potentialPackage = event.release.tag_name.split('/')[1]?.split('@')[0];
	if (!potentialPackage && /^\d+\.\d+\.\d+$/gm.test(event.release.tag_name)) potentialPackage = PackageName.DiscordJS;
	if (!potentialPackage) return 'monorepo';
	return getPotentialPackageTarget(potentialPackage);
}
