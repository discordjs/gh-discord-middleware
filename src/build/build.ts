import { copyFile, mkdir, readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { dirname, basename, relative, join as pathJoin, sep as pathSep } from 'node:path';
import { nodeFileTrace } from '@vercel/nft';
import * as acorn from 'acorn';
import type { Program } from 'estree';
import {
	ConfigFileName,
	FunctionConfigFileName,
	FunctionDirectoryExtension,
	FunctionFilesLocation,
	NodeJSVersion,
	OutputDirectoryRelative,
} from './vercelConstants.js';
import type { Config, EdgeFunctionConfig, NodejsServerlessFunctionConfig } from './vercelTypes.js';

let hasMiddleware = false;

interface Entrypoint {
	source: string;
	destFolder: string;
	destFile: string;
	isEdge?: boolean;
}

async function writeBuildConfig(destFolder: string) {
	const config: Config = {
		version: 3,
		// Trailing slash, 404 handled by vercels own build step
		routes: [],
		// Cache modules and yarn cache
		cache: ['node_modules/**', '.yarn/cache/**'],
	};

	if (hasMiddleware) {
		// Mddleware Handler
		config.routes!.push({ src: '^/.*$', middlewarePath: 'middleware', continue: true });
	}

	config.routes!.push(
		{
			handle: 'filesystem',
		},
		// API Routes
		{
			src: '^/api(/.*)?$',
			status: 404,
		},
		{
			handle: 'error',
		},
	);
	await writeFile(pathJoin(destFolder, ConfigFileName), JSON.stringify(config, null, 2));
}

async function writeFunctionConfig(func: Entrypoint) {
	const handler = relative(func.destFolder, func.destFile);
	let config: EdgeFunctionConfig | NodejsServerlessFunctionConfig;
	if (func.isEdge) {
		const edgeConfig: EdgeFunctionConfig = {
			runtime: 'edge',
			entrypoint: handler,
		};
		config = edgeConfig;
	} else {
		const nodeConfig: NodejsServerlessFunctionConfig = {
			handler,
			runtime: NodeJSVersion,
			launcherType: 'Nodejs',
			shouldAddHelpers: true,
			shouldAddSourceMapSupport: true,
		};
		config = nodeConfig;
	}
	await writeFile(pathJoin(func.destFolder, FunctionConfigFileName), JSON.stringify(config, null, 2));
}

function isProgramTree(ast: acorn.Node): ast is Program & { start: number; end: number; loc?: acorn.SourceLocation } {
	return ast.type === 'Program';
}

async function isEdgeFunction(fileName: string) {
	if (fileName.endsWith('middleware.js')) {
		hasMiddleware = true;
		return true;
	}

	// Generate AST to figure out of there is a config export and what it is if so
	const rawFile = (await readFile(fileName)).toString();
	const ast = acorn.parse(rawFile, { ecmaVersion: 2022, allowAwaitOutsideFunction: true, sourceType: 'module' });
	if (!isProgramTree(ast)) return false;
	for (const node of ast.body) {
		// Is this a named export
		if (node.type !== 'ExportNamedDeclaration') continue;
		// Is this a const export
		if (node.declaration?.type !== 'VariableDeclaration') continue;
		// Just in case
		if (node.declaration.declarations.length !== 1) continue;
		const declaration = node.declaration.declarations[0]!;
		// Is this a config export
		if (declaration.id.type !== 'Identifier' || declaration.id.name !== 'config') continue;
		// This is a config export, whats in it
		// If not object, discard (could be a variable, not dealing with that, requires recursively searching the AST)
		if (declaration.init?.type !== 'ObjectExpression') return false;
		for (const property of declaration.init.properties) {
			if (property.type !== 'Property') continue;
			// We only care about runtime
			if (property.key.type !== 'Identifier' || property.key.name !== 'runtime') continue;
			if (property.value.type !== 'Literal') return false;
			if (property.value.value === 'experimental-edge') return true;
			return false;
		}
		return false;
	}
	return false;
}

async function copyFileWithMap(source: string, dest: string) {
	await mkdir(dirname(dest), { recursive: true });
	await copyFile(source, dest);
	const mapFile = `${source}.map`;
	const map = await stat(mapFile).catch(() => {
		/* No-Op */
	});
	if (map) await copyFile(mapFile, `${dest}.map`);
}

async function findEntrypoints(source: string, destination: string, base = source): Promise<Entrypoint[]> {
	if (basename(source).startsWith('_')) return [];
	const fileInfo = await stat(source).catch((err) => {
		console.error(`Error reading stats for ${source}`, err);
	});
	if (!fileInfo) return [];
	if (fileInfo.isFile()) {
		if (source.endsWith('.js')) {
			const destFolder = pathJoin(
				dirname(destination),
				`${basename(source).split('.')[0]!}${FunctionDirectoryExtension}`,
			);
			return [{ source, destFolder, destFile: pathJoin(destFolder, relative(base, source)) }];
		}
		return [];
	}
	const files = await readdir(source).catch((err) => {
		console.error(`Error reading folder ${source}`, err);
	});
	if (!files) return [];
	const output: Entrypoint[] = [];
	for (const file of files) {
		if (base === source && !file.endsWith('api') && !file.endsWith('middleware.js')) continue;
		const entries = await findEntrypoints(pathJoin(source, file), pathJoin(destination, file), base);
		output.push(...entries);
	}
	return output;
}

// Run

const relativeToCwd = 'dist';
const outputDir = pathJoin(process.cwd(), OutputDirectoryRelative);

const entrypoints = await findEntrypoints(
	pathJoin(process.cwd(), relativeToCwd),
	pathJoin(outputDir, FunctionFilesLocation),
);

for (const entry of entrypoints) {
	entry.isEdge = await isEdgeFunction(entry.source);
	const { fileList } = await nodeFileTrace([entry.source], { web: entry.isEdge });
	for (const file of fileList) {
		let resolvedFile = file;
		if (file.startsWith(relativeToCwd)) {
			const split = file.split(pathSep);
			split.shift();
			resolvedFile = pathJoin(...split);
		}
		await copyFileWithMap(file, pathJoin(entry.destFolder, resolvedFile));
	}
	await writeFunctionConfig(entry);
}

await writeBuildConfig(outputDir);
