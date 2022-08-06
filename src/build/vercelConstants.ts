/**
 * The top level directory for the build output API
 */
export const OutputDirectoryRelative = '.vercel/output';

/**
 * The root config file
 */
export const ConfigFileName = 'config.json';

/**
 * Files placed within this directory will be made available at the root (/) of the Deployment URL
 * and neither their contents, nor their file name or extension will be modified in any way.
 * Sub directories within static are also retained in the URL, and are appended before the file name.
 */
export const StaticFilesLocation = '/static';

/**
 * The directory for all functions
 */
export const FunctionFilesLocation = '/functions';

/**
 * A Function is represented on the file system as a directory with a `.func` suffix on the name,
 * contained within the `.vercel/output/functions` directory.
 */
export const FunctionDirectoryExtension = '.func';

/**
 * The config file for each function
 */
export const FunctionConfigFileName = '.vc-config.json';

export const NodeJSVersion = 'nodejs16.x';
