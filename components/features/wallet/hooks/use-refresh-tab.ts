import { useSegments } from "expo-router";

export const useRefreshTab = (activeTab: string) => {
	const segments = useSegments();
	const currentTab = segments.join("/");
	console.log({ currentTab });
	const shouldRefresh = currentTab.includes(activeTab)
		? activeTab
		: `${Math.random()}`;
	console.log({ shouldRefresh, activeTab });
	return shouldRefresh;
};
