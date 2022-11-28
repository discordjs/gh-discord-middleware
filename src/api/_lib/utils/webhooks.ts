import { AppName, PackageName } from './constants.js';

const useForum = process.env.USE_FORUM === 'true';

const webhookBase = useForum ? process.env.DISCORD_WEBHOOK_FORUM_BASE : '';

if (typeof webhookBase !== 'string') {
	throw new TypeError('DISCORD_WEBHOOK_FORUM_BASE must be defined to use forums');
}

// If we don't cast then we have to add all the package / app names here again!
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const Webhooks = {
	monorepo: process.env.DISCORD_WEBHOOK_MONOREPO,
} as Record<`${AppName | PackageName}` | 'monorepo', string | undefined>;

for (const packageName of Object.entries(PackageName)) {
	Webhooks[packageName[1]] = process.env[`DISCORD_WEBHOOK_${packageName[0].toUpperCase()}`];
}

for (const appName of Object.entries(AppName)) {
	Webhooks[appName[1]] = process.env[`DISCORD_WEBHOOK_${appName[0].toUpperCase()}`];
}

const ForumWebhooks = Object.entries(Webhooks).reduce(
	(acc, [pack, val]) => ({ ...acc, [pack]: val ? `${webhookBase}?thread_id=${val}` : undefined }),
	{},
) as typeof Webhooks;

export const DiscordWebhooks = useForum ? ForumWebhooks : Webhooks;

export type DiscordWebhooksTarget = keyof typeof DiscordWebhooks | 'none';

export const OverrideWebhooks: Partial<Record<AppName | PackageName, DiscordWebhooksTarget>> = {
	'proxy-container': 'proxy',
};
