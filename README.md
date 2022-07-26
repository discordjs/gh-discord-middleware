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

gh-discord-middleware is a proxy based solution to split the [discord.js monorepo](https://github.com/discordjs/discord.js) outgoing webhooks to multiple channels / webhoks on the [discord.js discord server](https://discord.gg/djs).

# Vercel ENV keys

- `GITHUB_SECRET_TOK0EN` - a secret key used to secure incoming requests, if set
- `DISCARD_VERCEL_PR_COMMENTS` - whether to drop webhooks triggered by a pr comment from the vercel bot
- `DISCARD_VERCEL_COMMIT_COMMENTS` - whether to drop webhooks triggered by a commit comment from the vercel bot
- `DISCARD_CODECOV_COMMENTS` - whether to drop webhooks triggered by a comment from the codecov bot
- `DISCORD_WEBHOOK_MONOREPO` - the default webhook url to deliver all events to, unless they are split to another as defined below
- `DISCORD_WEBHOOK_BUILDERS` - the webhook to deliver events to if they are determined to be strictly related to @discordjs/builders
- `DISCORD_WEBHOOK_COLLECTION` - the webhook to deliver events to if they are determined to be strictly related to @discordjs/collection
- `DISCORD_WEBHOOK_CORE` - the webhook to deliver events to if they are determined to be strictly related to the discord.js core package
- `DISCORD_WEBHOOK_PROXY` - the webhook to deliver events to if they are determined to be strictly related to @discordjs/proxy and the proxy-container package
- `DISCORD_WEBHOOK_REST` - the webhook to deliver events to if they are determined to be strictly related to @discordjs/rest
- `DISCORD_WEBHOOK_VOICE` - the webhook to deliver events to if they are determined to be strictly related to @discordjs/voice
- `DISCORD_WEBHOOK_WEBSITE` - the webhook to deliver events to if they are determined to be strictly related to @discordjs/website

Each webhook url above needs to include /github on the end!
