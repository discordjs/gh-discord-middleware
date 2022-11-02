import type { PushEvent } from '@octokit/webhooks-types';
import { type AppName, AppNameValues, type PackageName, PackageNameValues } from '../utils/constants.js';
import { getFinalTarget } from '../utils/functions.js';
import type { DiscordWebhooksTarget } from '../utils/webhooks.js';

/**
 * Gets the target for incoming push type webhooks
 * @param event The event data
 * @returns The target name
 */
export function getPushRewriteTarget(event: PushEvent): DiscordWebhooksTarget {
	// Workaround for pre-monorepo
	if (event.ref === 'refs/heads/v13') return 'discord.js';

	const targets = new Set<AppName | PackageName>();

	for (const commit of event.commits) {
		for (const name of AppNameValues) {
			const prefix = `apps/${name}/`;
			if (commit.added.some((file) => file.startsWith(prefix))) {
				targets.add(name);
			}
			if (commit.modified.some((file) => file.startsWith(prefix))) {
				targets.add(name);
			}
			if (commit.removed.some((file) => file.startsWith(prefix))) {
				targets.add(name);
			}
		}
		for (const name of PackageNameValues) {
			const prefix = `packages/${name}/`;
			if (commit.added.some((file) => file.startsWith(prefix))) {
				targets.add(name);
			}
			if (commit.modified.some((file) => file.startsWith(prefix))) {
				targets.add(name);
			}
			if (commit.removed.some((file) => file.startsWith(prefix))) {
				targets.add(name);
			}
		}
	}

	const [firstPackage] = targets;
	if (targets.size === 1) return getFinalTarget(firstPackage!);
	return 'monorepo';
}
