import { getConfig } from "@/lib/search";
import { createSearch, indexCollectionsSync } from "@trythis/nextjs/search";
import path from "node:path";
import manifest from "./.docs/manifest.json";
import { consts } from "./lib/constants";

const cwd = process.cwd();
const docsDir = path.join(cwd, consts.docsDir);
const searchDir = path.join(cwd, consts.searchDir);

/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["geist"],
	images: {
		remotePatterns: [],
		unoptimized: true,
	},
	async redirects() {
		return [
			{
				source: "/confirm-auth",
				destination: "/",
				permanent: true,
			},
		];
	},
};

const skipIf = () => process.env.NODE_ENV !== "production";

const collections = indexCollectionsSync({
	docsDir,
	manifest,
	skipIf,
});

type Collection = (typeof collections)[number];

const withSearch = createSearch({
	searchDir,
	data: collections,
	document: getConfig<Collection>(),
});

export default withSearch(nextConfig);
