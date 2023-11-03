export const sortArrayByProperty = <T>(
	array: T[],
	property: string,
	order: "asc" | "desc" = "asc",
) => {
	if (!Array.isArray(array)) return;

	array.sort((a: any, b: any) => {
		const valueA = a[property]?.toLowerCase();
		const valueB = b[property]?.toLowerCase();

		let comparison = 0;

		if (valueA < valueB) {
			comparison = -1;
		} else if (valueA > valueB) {
			comparison = 1;
		}

		return order === "desc" ? comparison * -1 : comparison;
	});
};
