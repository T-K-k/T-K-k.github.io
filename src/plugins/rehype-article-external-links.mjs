import { relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { visit } from "unist-util-visit";

const contentDirectory = fileURLToPath(new URL("../content/", import.meta.url));

export function rehypeArticleExternalLinks({ site }) {
	const siteUrl = new URL(site);

	return (tree, file) => {
		if (!file.path) return;
		const [collection] = relative(contentDirectory, file.path).split(sep, 1);
		if (collection !== "posts" && collection !== "manuscripts") return;

		visit(tree, "element", (node) => {
			if (node.tagName !== "a") return;
			const { href, rel } = node.properties;
			if (typeof href !== "string" || !URL.canParse(href, siteUrl)) return;

			const url = new URL(href, siteUrl);
			if (url.protocol !== "https:" && url.protocol !== "http:") return;
			if (url.host === siteUrl.host) return;

			const relTokens = Array.isArray(rel)
				? rel
				: (String(rel ?? "").match(/\S+/g) ?? []);
			node.properties.target = "_blank";
			node.properties.rel = [
				...new Set([...relTokens, "noopener", "noreferrer"]),
			];
		});
	};
}
