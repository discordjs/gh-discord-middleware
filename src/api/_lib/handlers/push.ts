import type { PushEvent } from '@octokit/webhooks-types';
import { PackageName } from '../utils/constants.js';
import { DiscordWebhooksTarget, PerPackageWebhooks } from '../utils/webhooks.js';

/**
 * Gets the target for incoming push type webhooks
 * @param event The event data
 * @returns The target name
 */
export function getPushRewriteTarget(event: PushEvent): DiscordWebhooksTarget {
	// Workaround for pre-monorepo
	if (event.ref === 'refs/heads/v13') return 'discord.js';

	const packages = new Set<PackageName>();

	for (const commit of event.commits) {
		for (const name of Object.values(PackageName)) {
			if (commit.added.some((file) => file.startsWith(`packages/${name}`))) {
				packages.add(name);
			}
			if (commit.modified.some((file) => file.startsWith(`packages/${name}`))) {
				packages.add(name);
			}
			if (commit.removed.some((file) => file.startsWith(`packages/${name}`))) {
				packages.add(name);
			}
		}
	}

	const [firstPackage] = packages;
	if (packages.size === 1) return PerPackageWebhooks[firstPackage!];
	return 'monorepo';
}
