import React, { useEffect, useContext, useReducer } from "react";
import reducer from "../reducers/filter_reducer";
import {
	LOAD_PRODUCTS,
	SET_GRIDVIEW,
	SET_LISTVIEW,
	UPDATE_SORT,
	SORT_PRODUCTS,
	UPDATE_FILTERS,
	FILTER_PRODUCTS,
	CLEAR_FILTERS,
} from "../actions";
import { useProductsContext } from "./products_context";

const initialState = {
	filteredProducts: [],
	allProducts: [],
	gridView: true,
	sort: "price-lowest",
	filters: {
		text: "",
		company: "all",
		category: "all",
		color: "all",
		minPrice: 0,
		maxPrice: 0,
		price: 0,
		shipping: false,
	},
};

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
	const { products } = useProductsContext();

	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		dispatch({ type: LOAD_PRODUCTS, payload: products });
	}, [products]);
	useEffect(() => {
		dispatch({ type: SORT_PRODUCTS, payload: state.sort });
	}, [products, state.filters, state.sort]);

	const changeToGridView = () => {
		dispatch({ type: SET_GRIDVIEW });
	};
	const changeToListView = () => {
		dispatch({ type: SET_LISTVIEW });
	};

	const updateSort = (e) => {
		dispatch({ type: UPDATE_SORT, payload: e.target.value });
	};

	const updateFilters = (e) => {
		e.preventDefault();
		let name = e.target.name;
		let value = e.target.value;
		if (name === "category") {
			value = e.target.textContent;
		} else if (name === "color") {
			value = e.target.dataset.color;
			console.log(value);
		} else if (name === "price") {
			value = Number(value);
		}
		dispatch({
			type: UPDATE_FILTERS,
			payload: { value: value, name: name },
		});
		dispatch({
			type: FILTER_PRODUCTS,
		});
	};
	const toggleShipping = (e) => {
		dispatch({
			type: UPDATE_FILTERS,
			payload: { value: e.target.checked, name: e.target.name },
		});
		dispatch({
			type: FILTER_PRODUCTS,
		});
	};
	const clearFilters = (e) => {
		dispatch({ type: CLEAR_FILTERS });
	};
	return (
		<FilterContext.Provider
			value={{
				...state,
				changeToGridView,
				changeToListView,
				updateSort,
				updateFilters,
				clearFilters,
				toggleShipping,
			}}>
			{children}
		</FilterContext.Provider>
	);
};
// make sure use
export const useFilterContext = () => {
	return useContext(FilterContext);
};
