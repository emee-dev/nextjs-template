import { v } from "@trythis/js-schema";

export const info = v
	.string()
	.describe("It responds with the same request body")
	.title("Create post");

export const responseBody = v.reply({
	ok: v.json({
		name: v.string().required(),
		service: v.string().required(),
	}),
});
