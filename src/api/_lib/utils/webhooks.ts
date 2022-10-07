import type { PackageName } from './constants.js';

const useForum = process.env.USE_FORUM === 'true';

const webhookBase = useForum ? process.env.DISCORD_WEBHOOK_FORUM_BASE : '';

if (typeof webhookBase !== 'string') {
	throw new TypeError('DISCORD_WEBHOOK_FORUM_BASE must be defined to use forums');
}

// TODO cleanup, somehow use PackageName to only update one place for new packages

const Webhooks = {
	monorepo: process.env.DISCORD_WEBHOOK_MONOREPO,
	brokers: process.env.DISCORD_WEBHOOK_BROKERS,
	builders: process.env.DISCORD_WEBHOOK_BUILDERS,
	collection: process.env.DISCORD_WEBHOOK_COLLECTION,
	'discord.js': process.env.DISCORD_WEBHOOK_DISCORDJS,
	guide: process.env.DISCORD_WEBHOOK_GUIDE,
	proxy: process.env.DISCORD_WEBHOOK_PROXY,
	rest: process.env.DISCORD_WEBHOOK_REST,
	sharder: process.env.DISCORD_WEBHOOK_SHARDER,
	structures: process.env.DISCORD_WEBHOOK_STRUCTURES,
	ui: process.env.DISCORD_WEBHOOK_UI,
	util: process.env.DISCORD_WEBHOOK_UTIL,
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
	brokers: 'brokers',
	builders: 'builders',
	collection: 'collection',
	'discord.js': 'discord.js',
	docgen: 'monorepo',
	guide: 'guide',
	proxy: 'proxy',
	'proxy-container': 'proxy',
	rest: 'rest',
	scripts: 'monorepo',
	sharder: 'sharder',
	structures: 'structures',
	ui: 'ui',
	util: 'util',
	voice: 'voice',
	website: 'website',
	ws: 'ws',
};
