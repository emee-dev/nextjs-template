import { readdir, rm } from "fs/promises";
import { join } from "path";

const ignore: string[] = [".github", "package.json", "scripts"];
const cwd: string = process.cwd();

const entries: string[] = await readdir(cwd);

const items = entries
	.filter((path) => !ignore.includes(path))
	.map((path) =>
		rm(join(cwd, path), {
			recursive: true,
			force: true,
		}),
	);

await Promise.all(items);
