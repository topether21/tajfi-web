import { useSegments } from "expo-router";

// TODO: IS THIS USED?
export const useTabsNavigation = (tabs: string[]) => {
	const segments = useSegments();
	const currentTab = segments.join("/");
	console.log({ currentTab });
	const hide = tabs.some((tab) => currentTab.includes(tab));
	console.log({ hide, tabs, currentTab });
	return { hide };
};
