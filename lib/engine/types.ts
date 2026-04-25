// Shape of resources/indicators.en.json

export type Scale = "frequency" | "agreement";

export type IndicatorItem = {
	id: string;
	prompt: string;
	safety?: boolean;
	distortion?: string;
	reverse?: boolean;
};

export type IndicatorBlock = {
	label: string;
	scale: Scale;
	items: IndicatorItem[];
	cutoffs?: { mild?: number; moderate?: number; moderatelySevere?: number; severe?: number };
};

export type IndicatorsConfig = {
	version: string;
	locale: string;
	discovery: Array<{ id: string; prompt: string; scale: Scale; routes: string[] }>;
	blocks: {
		depression?: IndicatorBlock;
		anxiety?: IndicatorBlock;
		distortions?: IndicatorBlock;
	};
};
