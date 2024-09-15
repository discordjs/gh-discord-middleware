import common from 'eslint-config-neon/common';
import edge from 'eslint-config-neon/edge';
import node from 'eslint-config-neon/node';
import prettier from 'eslint-config-neon/prettier';
import typescript from 'eslint-config-neon/typescript';
import merge from 'lodash.merge';
import tseslint from 'typescript-eslint';

const commonFiles = '{js,mjs,cjs,ts,mts,cts,jsx,tsx}';

const commonRuleset = merge(...common, { files: [`**/*${commonFiles}`] });

const nodeRuleset = merge(...node, { files: [`**/*${commonFiles}`] });

const typeScriptRuleset = merge(...typescript, {
	files: [`**/*${commonFiles}`],
	languageOptions: {
		parserOptions: {
			project: ['tsconfig.eslint.json', 'tsconfig.middleware.json'],
		},
	},
	rules: {
		'@typescript-eslint/consistent-type-definitions': [2, 'interface'],
	},
	settings: {
		'import/resolver': {
			typescript: {
				project: ['tsconfig.eslint.json', 'tsconfig.middleware.json'],
			},
		},
	},
});

const edgeRuleset = merge(...edge, { files: [`**/*${commonFiles}`] });

const prettierRuleset = merge(...prettier, { files: [`**/*${commonFiles}`] });

export default tseslint.config(
	{
		ignores: ['**/node_modules/', '.git/', '**/dist/', '**/template/', '**/coverage/'],
	},
	commonRuleset,
	nodeRuleset,
	typeScriptRuleset,
	{
		files: ['**/*{ts,mts,cts,tsx}'],
		rules: { 'jsdoc/no-undefined-types': 0 },
	},
	edgeRuleset,
	{
		files: ['**/*{js,mjs,cjs,jsx}'],
		rules: { 'tsdoc/syntax': 0 },
	},
	prettierRuleset,
);
