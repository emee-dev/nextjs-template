import { v } from "@trythis/js-schema";

export const servers = v.server("{{protocol}}//{{baseUrl}}").vars({
	protocol: v.string().enum(["http:", "https:"]).default("https:"),
	baseUrl: v
		.string()
		.enum(["localhost:3000", "api.vercel.com"])
		.default("api.vercel.com"),
});

export const bearerAuth = v.bearerAuth();
