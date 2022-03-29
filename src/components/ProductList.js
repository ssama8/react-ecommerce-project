import React from "react";
import { useFilterContext } from "../context/filter_context";
import GridView from "./GridView";
import ListView from "./ListView";

const ProductList = () => {
	const { filteredProducts, gridView } = useFilterContext();
	if (filteredProducts.length < 1) {
		return <h5 style={{ textTransform: "none" }}>Sorry, no products found</h5>;
	}
	return (
		<>
			{gridView ? (
				<GridView products={filteredProducts}></GridView>
			) : (
				<ListView products={filteredProducts}></ListView>
			)}
			;
		</>
	);
};

export default ProductList;
