import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
	input: 'src/api/webhook.ts',
	output: {
		dir: 'dist',
		format: 'esm',
		interop: 'auto',
		preserveModules: true,
		preserveModulesRoot: 'src',
		sourcemap: true,
	},
	plugins: [typescript(), nodeResolve({ browser: true })],
	shimMissingExports: true,
};
