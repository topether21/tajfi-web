// biome-ignore lint/suspicious/noExplicitAny: it is ok, it is a type for the require(<image>)
type Asset = any;

export type OnboardingItem = {
	id: string;
	title: string;
	text: string;
	asset: Asset;
};
