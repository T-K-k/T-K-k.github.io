import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

export type ContentCollection = "posts" | "manuscripts";
export type ContentEntry = CollectionEntry<ContentCollection>;

// Retrieve published entries from one section only.
async function getRawSortedPosts(collection: ContentCollection = "posts") {
	const allBlogPosts = await getCollection(collection, ({ data }) => {
		return data.draft !== true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateB.getTime() - dateA.getTime() || a.slug.localeCompare(b.slug);
	});
	return sorted;
}

export async function getSortedPosts(collection: ContentCollection = "posts") {
	const sorted = await getRawSortedPosts(collection);
	// Derive neighbours from this collection; do not mutate cached entries or trust frontmatter links.
	return sorted.map((entry, i) => ({
		...entry,
		data: {
			...entry.data,
			nextSlug: sorted[i - 1]?.slug || "",
			nextTitle: sorted[i - 1]?.data.title || "",
			prevSlug: sorted[i + 1]?.slug || "",
			prevTitle: sorted[i + 1]?.data.title || "",
		},
	}));
}
export type PostForList = {
	slug: string;
	data: ContentEntry["data"];
};
export async function getSortedPostsList(collection: ContentCollection = "posts"): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts(collection);

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(collection: ContentCollection = "posts"): Promise<Tag[]> {
	const allBlogPosts = await getRawSortedPosts(collection);

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(collection: ContentCollection = "posts"): Promise<Category[]> {
	const allBlogPosts = await getRawSortedPosts(collection);
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c, collection),
		});
	}
	return ret;
}
