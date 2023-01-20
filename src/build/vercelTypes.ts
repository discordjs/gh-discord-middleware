/* eslint-disable typescript-sort-keys/interface */
/**
 * Schema for `config.json`
 *
 * The `config.json` file contains configuration information and metadata for a Deployment
 */
export interface Config {
	/**
	 * The `version` property indicates which version of the Build Output API has been implemented.
	 */
	version: 3;
	/**
	 * The `routes` property describes the routing rules that will be applied to the Deployment.
	 */
	routes?: Route[];
	/**
	 * Describes the image optimization configuration when utilizing Vercel's native Image Optimization feature,
	 * which automatically adjusts the size and quality of your images,
	 * to make sure they are served to your visitors as quickly as possible.
	 */
	images?: ImagesConfig;
	/**
	 * Relates to Vercel's Internationalization feature.
	 * The way it works is the domain names listed in this array are mapped to the `$wildcard` routing variable,
	 * which can be referenced by the `routes` configuration.
	 */
	wildcard?: WildcardConfig;
	/**
	 * Allows for overriding the output of one or more static files contained within the `.vercel/output/static` directory.
	 */
	overrides?: OverrideConfig;
	/**
	 * An array of file paths and/or glob patterns that should be re-populated
	 * within the build sandbox upon subsequent Deployments.
	 *
	 * Note that this property is only relevant when Vercel is building a Project from source code,
	 * meaning it is not relevant when building locally or when creating a Deployment from "prebuilt" build artifacts.
	 */
	cache?: string[];
}

/**
 * Routes may be used to point certain URL paths to others on your Deployment, attach response headers to paths,
 * and various other routing-related use-cases.
 */
export type Route = Handler | Source;

export interface Source {
	/**
	 * A PCRE-compatible regular expression that matches each incoming pathname (excluding querystring).
	 */
	src: string;
	/**
	 * A destination pathname or full URL, including querystring,
	 * with the ability to embed capture groups as $1, $2, or named capture value $name.
	 */
	dest?: string;
	/**
	 * A set of headers to apply for responses.
	 */
	headers?: Record<string, string>;
	/**
	 * A set of HTTP method types.
	 * If no method is provided, requests with any HTTP method will be a candidate for the route.
	 */
	methods?: string[];
	/**
	 * A boolean to change matching behavior. If true, routing will continue even when the src is matched.
	 */
	continue?: boolean;
	/**
	 * Specifies whether or not the route `src` should match with case sensitivity.
	 */
	caseSensitive?: boolean;
	/**
	 * If `true`, the route triggers `handle: 'filesystem'` and `handle: 'rewrite'`
	 */
	check?: boolean;
	/**
	 * A status code to respond with. Can be used in tandem with Location: header to implement redirects.
	 */
	status?: number;
	/**
	 * Conditions of the HTTP request that must exist to apply the route.
	 */
	has?: HasField[];
	/**
	 * Conditions of the HTTP request that must NOT exist to match the route.
	 */
	missing?: HasField[];
	/**
	 * Conditions of the Locale of the requester that will redirect the browser to different routes.
	 */
	locale?: Locale;
	/**
	 * A middleware name that matches an Edge Function path that should be invoked as middleware.
	 */
	middlewarePath?: string;
}

export interface Locale {
	/**
	 * An object of keys that represent locales to check for (`en`, `fr`, etc.)
	 * that map to routes to redirect to (`/`, `/fr`, etc.).
	 */
	redirect?: Record<string, string>;
	/**
	 * Cookie name that can override the Accept-Language header for determining the current locale.
	 */
	cookie?: string;
}

export type HasField = CookieHasField | HeaderHasField | HostHasField | QueryHasField;

export const enum HasFieldType {
	Cookie = 'cookie',
	Header = 'header',
	Host = 'host',
	Query = 'query',
}

export interface BaseHasField {
	/**
	 * Determines the HasField type.
	 */
	type: HasFieldType;
	value?: string;
}

export interface HostHasField extends BaseHasField {
	type: HasFieldType.Host;
	/**
	 * Host name that must match the request URL's host to cause this route to match.
	 */
	value: string;
}

export interface HeaderHasField extends BaseHasField {
	type: HasFieldType.Header;
	/**
	 * Header name that must exist on the request for this route to match.
	 */
	key: string;
	/**
	 * Header value (or regex) that must match for this route to match.
	 */
	value?: string;
}

export interface CookieHasField extends BaseHasField {
	type: HasFieldType.Cookie;
	/**
	 * Cookie name that must exist on the request for this route to match.
	 */
	key: string;
	/**
	 * Cookie value (or regex) that must match for this route to match.
	 */
	value?: string;
}

export interface QueryHasField extends BaseHasField {
	type: HasFieldType.Query;
	/**
	 * Querystring key to look for.
	 */
	key: string;
	/**
	 * Querystring value (or regex) that must match for this route to match.
	 */
	value?: string;
}

export type HandleValue =
	| 'error' //  check matches after error (500, 404, etc.)
	| 'filesystem' // check matches after the filesystem misses
	| 'hit'
	| 'miss' // check matches after every filesystem miss
	| 'resource'
	| 'rewrite';

/**
 * The routing system has multiple phases. The handle value indicates the start of a phase.
 * All following routes are only checked in that phase.
 */
export interface Handler {
	/**
	 * The phase of routing when all subsequent routes should apply.
	 */
	handle: HandleValue;
	/**
	 * A PCRE-compatible regular expression that matches each incoming pathname (excluding querystring).
	 */
	src?: string;
	/**
	 * A destination pathname or full URL, including querystring, with the ability to embed capture groups as $1, $2.
	 */
	dest?: string;
	/**
	 * A status code to respond with. Can be used in tandem with `Location:` header to implement redirects.
	 */
	status?: number;
}

export type ImageFormat = 'image/avif' | 'image/webp';

/**
 * Describes the image optimization configuration when utilizing Vercel's native Image Optimization feature,
 * which automatically adjusts the size and quality of your images,
 * to make sure they are served to your visitors as quickly as possible.
 */
export interface ImagesConfig {
	/**
	 * Supported image widths.
	 */
	sizes: number[];
	/**
	 * Allowed external domains that can use Image Optimization.
	 * Leave empty for only allowing the deployment domain to use Image Optimization.
	 */
	domains: string[];
	/**
	 * Cache duration (in seconds) for the optimized images.
	 */
	minimumCacheTTL?: number;
	/**
	 * Supported output image formats
	 */
	formats?: ImageFormat[];
	/**
	 * Allow SVG input image URLs. This is disabled by default for security purposes.
	 *
	 * @defaultValue false
	 */
	dangerouslyAllowSVG?: boolean;
	/**
	 * Change the Content Security Policy of the optimized images.
	 */
	contentSecurityPolicy?: string;
}

export interface WildCard {
	/**
	 * The domain name to match for this wildcard configuration.
	 */
	domain: string;
	/**
	 * The value of the `$wildcard` match that will be available for `routes` to utilize.
	 */
	value: string;
}

/**
 * Relates to Vercel's Internationalization feature.
 * The way it works is the domain names listed in this array are mapped to the `$wildcard` routing variable,
 * which can be referenced by the `routes` configuration.
 *
 * Each of the domain names specified in the wildcard configuration
 * will need to be assigned as Production Domainsin the Project Settings.
 */
export type WildcardConfig = WildCard[];

export interface Override {
	/**
	 * The URL path where the static file will be accessible from.
	 */
	path?: string;
	/**
	 * The value of the `Content-Type` HTTP response header that will be served with the static file.
	 */
	contentType?: string;
}

/**
 * Allows for overriding the output of one or more static files contained within the `.vercel/output/static` directory.
 *
 * The main use-cases are to override the `Content-Type` header that will be served for a static file,
 * and/or to serve a static file in the Vercel Deployment from a different URL path
 * than how it is stored on the file system.
 */
export type OverrideConfig = Record<string, Override>;

/**
 * Configuration schema for serverless functions
 *
 * The `.vc-config.json` configuration file contains information
 * related to how the Serverless Function will be created by Vercel.
 */
export interface ServerlessFunctionConfig {
	/**
	 * Indicates the initial file where code will be executed for the Serverless Function.
	 */
	handler: string;
	/**
	 * Specifies which "runtime" will be used to execute the Serverless Function.
	 */
	runtime: string;
	/**
	 * Amount of memory (RAM in MB) that will be allocated to the Serverless Function.
	 */
	memory?: number;
	/**
	 * Maximum execution duration (in seconds) that will be allowed for the Serverless Function.
	 */
	maxDuration?: number;
	/**
	 * Map of additional environment variables that will be available to the Serverless Function,
	 * in addition to the env vars specified in the Project Settings.
	 */
	environment?: Record<string, string>;
	allowQuery?: string[];
	/**
	 * List of Vercel Regions where the Serverless Function will be deployed to.
	 */
	regions?: string[];
}

/**
 * Configuration schema for Node.JS serverless functions
 *
 * The `.vc-config.json` configuration file contains information
 * related to how the Serverless Function will be created by Vercel,
 * exteding the default, specific to node js.
 */
export interface NodejsServerlessFunctionConfig extends ServerlessFunctionConfig {
	/**
	 * Specifies which launcher to use. Currently only "Nodejs" is supported.
	 */
	launcherType: 'Nodejs';
	/**
	 * Enables request and response helpers methods.
	 *
	 * @defaultValue false
	 */
	shouldAddHelpers?: boolean;
	/**
	 * Enables source map generation.
	 *
	 * @defaultValue false
	 */
	shouldAddSourceMapSupport?: boolean;
	/**
	 * AWS Handler Value for when the serverless function uses AWS Lambda syntax.
	 */
	awsLambdaHandler?: string;
}

/**
 * Configuration schema for edge functions
 *
 * JavaScript source files placed within the .func directory are bundled at build-time.
 * A WASM file may also be placed in this directory for an Edge Function to utilize.
 */
export interface EdgeFunctionConfig {
	/**
	 * The `runtime: "edge"` property is required to indicate that this directory represents an Edge Function.
	 */
	runtime: 'edge';
	/**
	 * Indicates the initial file where code will be executed for the Edge Function.
	 */
	entrypoint: string;
	/**
	 * List of environment variable names that will be available for the Edge Function to utilize.
	 */
	envVarsInUse?: string[];
}

export interface FunctionConfig {
	runtime?: string;
}
