import { v } from "@trythis/js-schema";

export const info = v
	.string()
	.describe(
		"Update a project domain’s configuration, including the name, git branch and redirect of the domain.",
	)
	.title("Update a project domain");

export const paramsPath = v.object({
	idOrName: v
		.string()
		.required()
		.describe("The unique project identifier or the project name"),
	domain: v
		.string()
		.required()
		.describe("The project domain name")
		.example("www.example.com"),
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

export const requestBody = v.object({
	gitBranch: v
		.oneOf([v.string().max(250), v.null()])
		.describe("Git branch to link the project domain"),

	redirect: v
		.oneOf([v.string().example("foobar.com"), v.null()])
		.describe("Target destination domain for redirect"),
	redirectStatusCode: v
		.oneOf([
			v.number().enum([301, 302, 307, 308]).example(307),
			v.null(),
		])
		.describe("Status code for domain redirect"),
});

export const responseBody = v.reply({
	ok: v.json({
		name: v.string().required(),
		apexName: v.string().required(),
		projectId: v.string().required(),
		verified: v
			.boolean()
			.required()
			.describe(
				"true if the domain is verified for use with the project. If false it will not be used as an alias on this project until the challenge in verification is completed.",
			),
		redirect: v.oneOf([v.string(), v.null()]),
		redirectStatusCode: v.oneOf([
			v.number().enum([301, 302, 307, 308]),
			v.null(),
		]),
		gitBranch: v.oneOf([v.string(), v.null()]),
		customEnvironmentId: v.oneOf([v.string(), v.null()]),
		updatedAt: v.number(),
		createdAt: v.number(),
		verification: v
			.array(
				v.object({
					type: v.string().required(),
					domain: v.string().required(),
					value: v.string().required(),
					reason: v.string().required(),
				}),
			)
			.describe(
				"A list of verification challenges, one of which must be completed to verify the domain for use on the project. After the challenge is complete POST /projects/:idOrName/domains/:domain/verify to verify the domain. Possible challenges: - If verification.type = TXT the verification.domain will be checked for a TXT record matching verification.value.",
			),
	}),
});
