import type { Label } from '@octokit/webhooks-types';
import type { PackageName } from './constants.js';
import { PerPackageWebhooks } from './webhooks.js';

/**
 * `Array#includes` but it works for enums
 * @param enumeration The enum
 * @param value The value to check includes for
 * @returns Whether the enum includes value (also asserts it to the array type)
 */
export function enumIncludes<StrictType extends Generic, Generic>(
	enumeration: Record<string, StrictType>,
	value: Generic,
): value is StrictType {
	return Object.values(enumeration).includes(value as StrictType);
}

/**
 * Gets the target for a (potential) package name, if the package name isn't found, returns `monorepo`
 * @param potentialPackage The package name to try to get a target for
 * @returns The determined target
 */
export function getPotentialPackageTarget(potentialPackage: string) {
	const target = PerPackageWebhooks[potentialPackage.trim().toLowerCase() as PackageName];
	// Probablly not often but if a package label is added that isn't accounted for it should just go to the monorepo webhook
	// Same if user edits a packge name manually in an issue description
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!target) return 'monorepo';
	return target;
}

/**
 * Get the target for a pull request or issue with labels, null if there were no identifying labels
 * @param labels The labels on the pull request or issue
 * @returns The determined target
 */
export function getPackageLabelTarget(labels?: Label[]) {
	if (!labels) return null;
	const packageLabels = labels.filter((label) => label.name.startsWith('packages:'));
	if (packageLabels.length < 1) return null;
	if (packageLabels.length > 1) return 'monorepo';
	return getPotentialPackageTarget(packageLabels[0]!.name.split(':')[1]!);
}
