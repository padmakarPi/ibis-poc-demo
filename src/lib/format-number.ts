export const formatNumber = (value: number) => {
	const options = {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	};

	return Number.isNaN(value)
		? 0.0
		: Number(value).toLocaleString("en", options);
};
