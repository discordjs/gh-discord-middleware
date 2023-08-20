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

| Key                          | Description                                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| `GITHUB_SECRET_TOKEN`        | A secret key used to secure incoming requests, if set                                          |
| `DISCORD_WEBHOOK_FORUM_BASE` | The base webhook URL (include `/github`) to be used for posting all events, split by thread id |
