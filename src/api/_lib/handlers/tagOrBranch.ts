import type { CreateEvent, DeleteEvent } from '@octokit/webhooks-types';
import { getPotentialTarget } from '../utils/functions.js';

/**
 * Gets the target for incoming create or delete type webhooks
 *
 * @param event - The event data
 * @returns The target name
 */
export function getTagOrBranchTarget(event: CreateEvent | DeleteEvent): string {
	let potentialPackage = event.ref.split('/')[1]?.split('@')[0];
	if (!potentialPackage && /^\d+\.\d+\.\d+$/gm.test(event.ref)) potentialPackage = 'discord.js';
	if (!potentialPackage) return 'monorepo';
	return getPotentialTarget(potentialPackage);
}
