import type { PackageName } from './constants.js';

const useForum = process.env.USE_FORUM === 'true';

const webhookBase = useForum ? process.env.DISCORD_WEBHOOK_FORUM_BASE : '';

if (typeof webhookBase !== 'string') {
	throw new TypeError('DISCORD_WEBHOOK_FORUM_BASE must be defined to use forums');
}

const Webhooks = {
	monorepo: process.env.DISCORD_WEBHOOK_MONOREPO,
	builders: process.env.DISCORD_WEBHOOK_BUILDERS,
	collection: process.env.DISCORD_WEBHOOK_COLLECTION,
	'discord.js': process.env.DISCORD_WEBHOOK_DISCORDJS,
	proxy: process.env.DISCORD_WEBHOOK_PROXY,
	rest: process.env.DISCORD_WEBHOOK_REST,
	voice: process.env.DISCORD_WEBHOOK_VOICE,
	website: process.env.DISCORD_WEBHOOK_WEBSITE,
	ws: process.env.DISCORD_WEBHOOK_WS,
} as const;

const ForumWebhooks = Object.entries(Webhooks).reduce(
	(acc, [pack, val]) => ({ ...acc, [pack]: val ? `${webhookBase}?thread_id=${val}` : undefined }),
	{},
) as typeof Webhooks;

export const DiscordWebhooks = useForum ? ForumWebhooks : Webhooks;

export type DiscordWebhooksTarget = keyof typeof DiscordWebhooks | 'none';

export const PerPackageWebhooks: Record<PackageName, DiscordWebhooksTarget> = {
	actions: 'monorepo',
	builders: 'builders',
	collection: 'collection',
	'discord.js': 'discord.js',
	docgen: 'monorepo',
	proxy: 'proxy',
	'proxy-container': 'proxy',
	rest: 'rest',
	scripts: 'monorepo',
	voice: 'voice',
	website: 'website',
	ws: 'ws',
};
