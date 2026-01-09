import { DocSearch } from "@/components/fumastudio/search-dialog";
import { ThemeSelector } from "@/components/fumastudio/theme-selector";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { consts } from "@/lib/constants";
import { useMDXComponents } from "@/mdx-components";
import { SettingsProvider } from "@/providers/settings-provider";
import {
	compileSource,
	DocCache,
	DocLoader,
	importTemplate,
} from "@trythis/nextjs";
import { createNavigation } from "@trythis/nextjs/lib";
import { notFound, redirect, RedirectType } from "next/navigation";
import { join } from "path";
import { AppSidebar } from "./app-sidebar";

type PageSearchParams = {
	/** Optional search query string */
	s?: string;
};

type PageParams = { slug: string[] };

type PageProps = {
	params: Promise<PageParams>;
	searchParams: Promise<PageSearchParams>;
};

const cwd = process.cwd();
const SOURCE_DIR = join(cwd, consts.docsDir);
const segment = "/api-reference/[[...slug]]";

export default async function Page(props: PageProps) {
	const docLoader = new DocLoader(SOURCE_DIR, DocCache.getInstance());
	const { error, data } = await docLoader.pageDocs(props, segment);

	if (error) {
		return notFound();
	}

	const { filetree, request, requestSlug, currentBranch, redirectUrl } =
		data;

	if (redirectUrl) {
		return redirect(redirectUrl, RedirectType.replace);
	}

	const navigation = createNavigation(requestSlug, filetree);

	const { content } = await compileSource({
		source: request.content,
		components: useMDXComponents(),
		scope: {
			scope_pagination_at_runtime: navigation,
			serverCtx: {
				pathSlug: requestSlug,
				currentBranch,
			},
		},
	});

	const { data: templateData } = await importTemplate();

	return (
		<SidebarProvider>
			<AppSidebar filetree={filetree} />

			<SidebarInset>
				<div className="flex items-center h-14 gap-2 px-4 border-b shrink-0">
					<div className="flex items-center">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
					</div>

					<div className="flex items-center ml-auto">
						<DocSearch />
						<ThemeSelector />
					</div>
				</div>

				<SettingsProvider template={templateData}>
					<div className="flex flex-col flex-1 gap-4 pt-24 mx-auto w-full max-w-[70rem] px-16 md:max-w-[60rem] md:px-24 group is-api-page">
						{content}
					</div>
				</SettingsProvider>
			</SidebarInset>
		</SidebarProvider>
	);
}

export async function generateStaticParams() {
	const docLoader = new DocLoader(SOURCE_DIR, DocCache.getInstance());
	const { error, data } = await docLoader.preloadDocs();

	if (error) {
		throw new Error(error);
	}

	return data;
}

export async function generateMetadata(props: PageProps) {
	const docLoader = new DocLoader(SOURCE_DIR, DocCache.getInstance());
	const { data } = await docLoader.getMetaData(props, segment);
	return data;
}
