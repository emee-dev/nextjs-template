import { v } from "@trythis/js-schema";

export const info = v
	.string()
	.describe(
		"Get the information for a specific project by passing either the project id or name in the URL.",
	)
	.title("Find a project by id or name");

export const paramsPath = v.object({
	idOrName: v
		.string()
		.required()
		.describe("The unique project identifier or the project name"),
});

export const paramsQuery = v.object({
	teamId: v
		.string()
		.describe(
			"The Team identifier to perform the request on behalf of.",
		)
		.example("team_1a2b3c4d5e6f7g8h9i0j1k2l"),

	slug: v
		.string()
		.describe("The Team slug to perform the request on behalf of.")
		.example("my-team-url-slug"),
});

export const responseBody = v.reply({
	ok: v.json({
		accountId: v.string().required(),
		directoryListing: v.boolean().required(),
		id: v.string().required(),
		name: v.string().required(),
		nodeVersion: v
			.string()
			.required()
			.enum([
				"24.x",
				"22.x",
				"20.x",
				"18.x",
				"16.x",
				"14.x",
				"12.x",
				"10.x",
				"8.10.x",
			]),
		framework: v
			.string()
			.enum(["blitzjs", "nextjs", "gatsby", "remix", "null"]),
		createdAt: v.number(),
		customerSupportCodeVisibility: v.boolean(),
		devCommand: v.oneOf([v.string(), v.null()]),
		installCommand: v.oneOf([v.string(), v.null()]),
		outputDirectory: v.oneOf([v.string(), v.null()]),
		publicSource: v.oneOf([v.boolean(), v.null()]),
		rootDirectory: v.oneOf([v.boolean(), v.null()]),
	}),
});
