import type { Endpoints } from '@octokit/types';
import type { Label } from '@octokit/webhooks-types';
import { AppNames, PackageNames, OverrideWebhooks } from './webhooks.js';

/**
 * `Array#includes` but it works for enums
 *
 * @param enumeration - The enum
 * @param value - The value to check includes for
 * @returns Whether the enum includes value (also asserts it to the array type)
 */
export function enumIncludes<StrictType extends Generic, Generic>(
	enumeration: Record<string, StrictType>,
	value: Generic,
): value is StrictType {
	return Object.values(enumeration).includes(value as StrictType);
}

/**
 * `Array#includes` but it asserts the type
 *
 * @param array - The array
 * @param value - The value to check includes for
 * @returns Whether the array includes value (also asserts it to the array type)
 */
export function strictArrayIncludes<StrictType extends Generic, Generic>(
	array: StrictType[],
	value: Generic,
): value is StrictType {
	return array.includes(value as StrictType);
}

/**
 * Gets the final target for a package / app name, taking into account overrides
 *
 * @param target - The package / app name that is the initial target
 * @returns The determined final target
 */
export function getFinalTarget(target: string): string {
	// For some reason typescript doesn't get this
	if (target in OverrideWebhooks) return OverrideWebhooks[target]!;
	return target;
}

/**
 * Gets the target for a (potential) package / app name, if the package / app name isn't found, returns `monorepo`
 *
 * @param potentialName - The package / app name to try to get a target for
 * @returns The determined target
 */
export function getPotentialTarget(potentialName: string) {
	const parsedPotentialName = potentialName.trim().toLowerCase();

	// "Documentation" is what appears on issues—not "Website".
	const conformedPotentialName = parsedPotentialName === 'documentation' ? 'website' : parsedPotentialName;

	const isTarget = AppNames.includes(conformedPotentialName) || PackageNames.includes(conformedPotentialName);

	// Probably not often but if a package label is added that isn't accounted for it should just go to the monorepo webhook
	// Same if user edits a package name manually in an issue description
	if (!isTarget) return 'monorepo';

	return getFinalTarget(conformedPotentialName);
}

/**
 * Get the target for a pull request or issue with labels, null if there were no identifying labels
 *
 * @param labels - The labels on the pull request or issue
 * @returns The determined target
 */
export function getLabelTarget(labels?: Label[]) {
	if (!labels) return null;
	const packageAppLabels = labels.filter(
		(label) => label.name.startsWith('packages:') || label.name.startsWith('apps:'),
	);
	if (packageAppLabels.length < 1) return null;
	if (packageAppLabels.length > 1) return 'monorepo';
	return getPotentialTarget(packageAppLabels[0]!.name.split(':')[1]!);
}

/**
 * Get the target for a pull request or commit comment based on the changed files
 *
 * @param files - The files as returned by github
 * @returns The determined target
 */
export function getTargetFromFiles(
	files:
		| Endpoints['GET /repos/{owner}/{repo}/commits/{ref}']['response']['data']['files']
		| Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}/files']['response']['data'],
) {
	if (!files) return 'monorepo';
	let singleTarget: string | null = null;
	for (const name of AppNames) {
		if (files.some((file) => file.filename.startsWith(`apps/${name}/`))) {
			if (singleTarget) return 'monorepo';
			singleTarget = name;
		}
	}

	for (const name of PackageNames) {
		if (files.some((file) => file.filename.startsWith(`packages/${name}/`))) {
			if (singleTarget) return 'monorepo';
			singleTarget = name;
		}
	}

	if (!singleTarget) return 'monorepo';
	return getFinalTarget(singleTarget);
}
