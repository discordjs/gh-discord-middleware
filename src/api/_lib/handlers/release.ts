import type { ReleaseEvent } from '@octokit/webhooks-types';
import { getPotentialTarget } from '../utils/functions.js';

/**
 * Gets the target for incoming release type webhooks
 *
 * @param event - The event data
 * @returns The target name
 */
export function getReleaseRewriteTarget(event: ReleaseEvent): string {
	let potentialPackage = event.release.tag_name.split('/')[1]?.split('@')[0];
	if (!potentialPackage && /^\d+\.\d+\.\d+$/gm.test(event.release.tag_name)) potentialPackage = 'discord.js';
	if (!potentialPackage) return 'monorepo';
	return getPotentialTarget(potentialPackage);
}
