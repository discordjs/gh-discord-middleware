<div align="center">
  <br />
  <p>
    <a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
  </p>
  <br />
  <p>
    <a href="https://discord.gg/djs"><img src="https://img.shields.io/discord/222078108977594368?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/npm/v/discord.js.svg?maxAge=3600" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/npm/dt/discord.js.svg?maxAge=3600" alt="npm downloads" /></a>
  </p>
  <p>
		<a href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"><img src="https://raw.githubusercontent.com/discordjs/discord.js/main/.github/powered-by-vercel.svg" alt="Vercel" /></a>
	</p>
</div>

# About

gh-discord-middleware is a proxy-based solution to split the [discord.js monorepo](https://github.com/discordjs/discord.js) outgoing webhooks to multiple channels / webhooks on the [discord.js Discord server](https://discord.gg/djs).

# Vercel ENV keys

| Key                                      | Description                                                                                                                                                                                                                                                                          |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GITHUB_SECRET_TOKEN`                    | A secret key used to secure incoming requests, if set                                                                                                                                                                                                                                |
| `DISCARD_VERCEL_PR_COMMENTS`             | Whether to drop webhooks triggered by a pull request comment from the Vercel bot                                                                                                                                                                                                     |
| `DISCARD_VERCEL_COMMIT_COMMENTS`         | Whether to drop webhooks triggered by a commit comment from the Vercel bot                                                                                                                                                                                                           |
| `DISCARD_CODECOV_COMMENTS`               | Whether to drop webhooks triggered by a comment from the Codecov bot                                                                                                                                                                                                                 |
| `DISCARD_GITHUB_ACTIONS_PR_COMMENTS`     | Whether to drop webhooks triggered by a pull request comment from the Github Actions bot                                                                                                                                                                                             |
| `DISCARD_GITHUB_ACTIONS_COMMIT_COMMENTS` | Whether to drop webhooks triggered by a commit comment from the Github Actions bot                                                                                                                                                                                                   |
| `USE_FORUM`                              | Whether to consider all webhook keys to be used for a forum, each being the thread id to send to. Requires `DISCORD_WEBHOOK_FORUM_BASE` to be set                                                                                                                                    |
| `DISCORD_WEBHOOK_FORUM_BASE`             | The base webhook URL (include `/github`) to be used for posting all events, split by thread id                                                                                                                                                                                       |
| `DISCORD_WEBHOOK_MONOREPO`               | The default webhook URL to deliver all events to, unless they are split to another as defined below                                                                                                                                                                                  |
| `DISCORD_WEBHOOK_BUILDERS`               | The webhook to deliver events to if they are determined to be strictly related to [@discordjs/builders](https://github.com/discordjs/discord.js/tree/main/packages/builders)                                                                                                         |
| `DISCORD_WEBHOOK_BROKERS`                | The webhook to deliver events to if they are determined to be strictly related to [@discordjs/brokers](https://github.com/discordjs/discord.js/tree/main/packages/brokers)                                                                                                           |
| `DISCORD_WEBHOOK_COLLECTION`             | The webhook to deliver events to if they are determined to be strictly related to [@discordjs/collection](https://github.com/discordjs/discord.js/tree/main/packages/collection)                                                                                                     |
| `DISCORD_WEBHOOK_DISCORDJS`              | The webhook to deliver events to if they are determined to be strictly related to the [discord.js core package](https://github.com/discordjs/discord.js/tree/main/packages/discord.js)                                                                                               |
| `DISCORD_WEBHOOK_GUIDE`                  | The webhook to deliver events to if they are determined to be strictly related to [@discordjs/guide](https://github.com/discordjs/discord.js/tree/main/packages/guide)                                                                                                               |
| `DISCORD_WEBHOOK_PROXY`                  | The webhook to deliver events to if they are determined to be strictly related to [@discordjs/proxy](https://github.com/discordjs/discord.js/tree/main/packages/proxy) and the [proxy-container package](https://github.com/discordjs/discord.js/tree/main/packages/proxy-container) |
| `DISCORD_WEBHOOK_REST`                   | The webhook to deliver events to if they are determined to be strictly related to [@discordjs/rest](https://github.com/discordjs/discord.js/tree/main/packages/rest)                                                                                                                 |
| `DISCORD_WEBHOOK_SHARDER`                | The webhook to deliver events to if they are determined to be strictly related to [@discordjs/sharder](https://github.com/discordjs/discord.js/tree/main/packages/sharder)                                                                                                           |
| `DISCORD_WEBHOOK_STRUCTURES`             | The webhook to deliver events to if they are determined to be strictly related to [@discordjs/structures](https://github.com/discordjs/discord.js/tree/main/packages/structures)                                                                                                     |
| `DISCORD_WEBHOOK_UI`                     | The webhook to deliver events to if they are determined to be strictly related to [@discordjs/ui](https://github.com/discordjs/discord.js/tree/main/packages/ui)                                                                                                                     |
| `DISCORD_WEBHOOK_UTIL`                   | The webhook to deliver events to if they are determined to be strictly related to [@discordjs/util](https://github.com/discordjs/discord.js/tree/main/packages/util)                                                                                                                 |
| `DISCORD_WEBHOOK_VOICE`                  | The webhook to deliver events to if they are determined to be strictly related to [@discordjs/voice](https://github.com/discordjs/discord.js/tree/main/packages/voice)                                                                                                               |
| `DISCORD_WEBHOOK_WEBSITE`                | The webhook to deliver events to if they are determined to be strictly related to [@discordjs/website](https://github.com/discordjs/discord.js/tree/main/packages/website)                                                                                                           |
| `DISCORD_WEBHOOK_WS`                     | The webhook to deliver events to if they are determined to be strictly related to [@discordjs/ws](https://github.com/discordjs/discord.js/tree/main/packages/ws)                                                                                                                     |

Each webhook URL above needs to include /github on the end!
