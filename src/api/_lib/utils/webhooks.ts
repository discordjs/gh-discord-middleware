import process from 'node:process';
import { getAll } from '@vercel/edge-config';
import type { EdgeConfig } from './constants.js';

const webhookBase = process.env.DISCORD_WEBHOOK_FORUM_BASE;

if (typeof webhookBase !== 'string') {
	throw new TypeError('DISCORD_WEBHOOK_FORUM_BASE must be defined');
}

// This is effectively a cast, the types of these variables is not actually guaranteed
const { channelIds: ids, overrideWebhooks } = await getAll<EdgeConfig>(['channelIds', 'overrideWebhooks']);

if (!ids?.monorepo) {
	throw new TypeError('At least a monorepo id must be defined');
}

const appIds = ids.apps ?? {};
const packageIds = ids.packages ?? {};

export const AppNames = Object.keys(appIds);
if (overrideWebhooks?.apps) {
	for (const overridenApp of Object.keys(overrideWebhooks.apps)) {
		AppNames.push(overridenApp);
	}
}

export const PackageNames = Object.keys(packageIds);
if (overrideWebhooks?.packages) {
	for (const overridenPackage of Object.keys(overrideWebhooks.packages)) {
		PackageNames.push(overridenPackage);
	}
}

export const OverrideWebhooks = overrideWebhooks ? { ...overrideWebhooks.apps, ...overrideWebhooks.packages } : {};

// If we don't cast then it only has the monorepo key
const Webhooks = {
	monorepo: ids.monorepo,
	...appIds,
	...packageIds,
} as { [target: string]: string; monorepo: string };

const ForumWebhooks = Object.fromEntries(
	Object.entries(Webhooks).map(([pack, val]) => [pack, val ? `${webhookBase}?thread_id=${val}` : undefined]),
) as typeof Webhooks;

export const DiscordWebhooks = ForumWebhooks;
