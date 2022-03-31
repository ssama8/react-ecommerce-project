export const formatPrice = (price) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(price / 100);
};

export const getUniqueValues = (products, type) => {
	let unique = products.map((item) => item[type]);
	if (type === "colors") {
		console.log(unique.flat());
		unique = unique.flat();
	}
	return ["all", ...new Set(unique)];
};
