import type React from "react";
import { createContext, useContext, useState } from "react";

interface TabBarVisibilityContextProps {
	isVisible: boolean;
	setIsVisible: (visible: boolean) => void;
}

const TabBarVisibilityContext = createContext<
	TabBarVisibilityContextProps | undefined
>(undefined);

export const TabBarVisibilityProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [isVisible, setIsVisible] = useState(true);

	return (
		<TabBarVisibilityContext.Provider value={{ isVisible, setIsVisible }}>
			{children}
		</TabBarVisibilityContext.Provider>
	);
};

export const useTabBarVisibility = () => {
	const context = useContext(TabBarVisibilityContext);
	if (!context) {
		throw new Error(
			"useTabBarVisibility must be used within a TabBarVisibilityProvider",
		);
	}
	return context;
};
