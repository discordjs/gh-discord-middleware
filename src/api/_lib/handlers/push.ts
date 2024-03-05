import type { Commit, PushEvent } from '@octokit/webhooks-types';
import { filterPushes } from '../utils/filters.js';
import { getFinalTarget } from '../utils/functions.js';
import { AppNames, PackageNames } from '../utils/webhooks.js';

/**
 * Checks if a paths files were modified
 *
 * @param prefix - The paths whose files to check
 * @param commit - The commit details
 */
function checkModified(prefix: string, commit: Commit) {
	return (
		commit.added.some((file) => file.startsWith(prefix)) ||
		commit.modified.some((file) => file.startsWith(prefix)) ||
		commit.removed.some((file) => file.startsWith(prefix))
	);
}

/**
 * Gets the target for incoming push type webhooks
 *
 * @param event - The event data
 * @returns The target name
 */
export function getPushRewriteTarget(event: PushEvent): string {
	if (filterPushes(event)) return 'none';
	// Workaround for pre-monorepo
	if (event.ref === 'refs/heads/v13') return 'discord.js';

	const targets = new Set<string>();

	for (const commit of event.commits) {
		for (const name of AppNames) {
			if (checkModified(`apps/${name}`, commit)) {
				targets.add(name);
			}
		}

		for (const name of PackageNames) {
			if (checkModified(`packages/${name}`, commit)) {
				targets.add(name);
			}
		}
	}

	const [firstPackage] = targets;
	if (targets.size === 1) return getFinalTarget(firstPackage!);
	return 'monorepo';
}
