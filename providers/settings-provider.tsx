"use client";

import { createContext, type ReactNode, useContext } from "react";

export type Socials = {
	href: string;
	label: string;
	iconUrl: string;
};

export interface CopyPageDropdown {
	id: string;
	label: string;
	description: string;
	url?: string;
	icon?: React.ReactNode;
}

type CopyPageOptions = {
	enabled: boolean;
	enableDropdown?: boolean;
	dropdown?: CopyPageDropdown[];
};

export type Settings = {
	enableTryItButton?: boolean;
	poweredBy?: ReactNode | null;
	socials?: Socials[];
	copyPage?: CopyPageOptions;
};

const SettingsContext = createContext<Settings | null>(null);

const defaultTemplateSettings: Settings = {
	enableTryItButton: false,
	poweredBy: null,
	socials: [],
	copyPage: {
		enabled: true,
		enableDropdown: true,
		dropdown: [],
	},
};

export function SettingsProvider(props: {
	children: ReactNode;
	template: Settings | null;
}) {
	return (
		<SettingsContext.Provider
			value={
				props.template
					? props.template
					: defaultTemplateSettings
			}
		>
			{props.children}
		</SettingsContext.Provider>
	);
}

export const useSettings = () => {
	const ctx = useContext(SettingsContext);
	if (!ctx)
		throw new Error(
			"useSettings must be used inside <SettingsProvider />",
		);
	return ctx;
};
