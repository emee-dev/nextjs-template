import { v } from "@trythis/js-schema";

export const info = v
	.string()
	.describe(
		"Allows to create a new project with the provided configuration. It only requires the project name but more configuration can be provided to override the defaults.",
	)
	.title("Create a new project");

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
	name: v
		.string()
		.required()
		.describe("The desired name for the project")
		.max(100)
		.example("a-project-name"),

	enablePreviewFeedback: v
		.oneOf([v.boolean(), v.null()])
		.describe("Opt-in to preview toolbar on the project level"),

	enableProductionFeedback: v
		.oneOf([v.boolean(), v.null()])
		.describe("Opt-in to production toolbar on the project level"),
	previewDeploymentsDisabled: v
		.oneOf([v.boolean(), v.null()])
		.describe(
			"Specifies whether preview deployments are disabled for this project.",
		),
	previewDeploymentSuffix: v
		.oneOf([v.string().max(253), v.null()])
		.describe(
			"Custom domain suffix for preview deployments. Takes precedence over team-level suffix. Must be a domain owned by the team.",
		),
	buildCommand: v
		.oneOf([v.string().max(256), v.null()])
		.describe(
			"The build command for this project. When null is used this value will be automatically detected",
		),

	commandForIgnoringBuildStep: v.oneOf([v.string().max(256), v.null()]),

	devCommand: v
		.oneOf([v.string().max(256), v.null()])
		.describe(
			"The dev command for this project. When null is used this value will be automatically detected",
		),

	environmentVariables: v
		.array(
			v.object({
				key: v
					.string()
					.required()
					.describe("Name of the ENV variable"),
				value: v
					.string()
					.required()
					.describe("Value for the ENV variable"),
				target: v
					.string()
					.enum(["production", "preview", "development"])
					.required()
					.describe(
						"Deployment Target or Targets in which the ENV variable will be used",
					),

				gitBranch: v
					.string()
					.max(250)
					.describe(
						"If defined, the git branch of the environment variable (must have target=preview)",
					),

				type: v
					.string()
					.enum([
						"system",
						"secret",
						"encrypted",
						"plain",
						"sensitive",
					])
					.describe(
						"If defined, the git branch of the environment variable (must have target=preview)",
					),
			}),
		)
		.describe("Collection of ENV Variables the Project will use"),

	framework: v
		.string()
		.enum(["blitzjs", "nextjs", "gatsby", "remix", "null"])
		.default("nextjs")
		.describe(
			"The framework that is being used for this project. When null is used no framework is selected",
		),
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
