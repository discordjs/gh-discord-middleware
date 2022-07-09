/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	webpack: (config) => {
		config.module.rules.push({
			resolve: {
				alias: {
					'node-fetch': `${__dirname}/node_modules/node-fetch/browser.js`,
					'universal-user-agent': `${__dirname}/lib/polyfills/universal-user-agent.ts`,
				},
			},
		});

		return config;
	},
};

module.exports = nextConfig;
