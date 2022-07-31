import type { CreateEvent, DeleteEvent } from '@octokit/webhooks-types';
import { PackageName } from '../utils/constants';
import { getPotentialPackageTarget } from '../utils/functions';
import type { DiscordWebhooksTarget } from '../utils/webhooks';

/**
 * Gets the target for incoming create or delete type webhooks
 * @param event The event data
 * @returns The target name
 */
export function getTagOrBranchTarget(event: CreateEvent | DeleteEvent): DiscordWebhooksTarget {
	let potentialPackage = event.ref.split('/')[1]?.split('@')[0];
	if (!potentialPackage && /^\d+\.\d+\.\d+$/gm.test(event.ref)) potentialPackage = PackageName.DiscordJS;
	if (!potentialPackage) return 'monorepo';
	return getPotentialPackageTarget(potentialPackage);
}
