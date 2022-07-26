import type { PackageName } from './constants';

export const DiscordWebhooks = {
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
