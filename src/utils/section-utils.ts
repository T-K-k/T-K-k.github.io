import { siteConfig } from "../config";
import { pathsEqual, url } from "./url-utils";

// The two sections share Fuwari components, but keep their content and colors separate.
export function getSection(pathname: string): "posts" | "manuscripts" {
	return pathsEqual(pathname, url("/manuscripts/")) ||
		pathname.startsWith(url("/manuscripts/"))
		? "manuscripts"
		: "posts";
}

export function getSectionTheme(pathname: string) {
	const section = getSection(pathname);
	return {
		hue: section === "manuscripts" ? 250 : siteConfig.themeColor.hue,
		storageKey: `hue:${section}`,
	};
}

export function needsFullNavigation(from: string, to: string): boolean {
	return pathsEqual(to, url("/")) || getSection(from) !== getSection(to);
}
