import { toNextjsHandler } from "@trythis/nextjs";

export const { GET, POST } = toNextjsHandler({
	projectSecret: process.env.PROJECT_SECRET,
	fsSiteUrl: process.env.FS_SITE_URL,
});
