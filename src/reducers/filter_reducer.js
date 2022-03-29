import {
	LOAD_PRODUCTS,
	SET_LISTVIEW,
	SET_GRIDVIEW,
	UPDATE_SORT,
	SORT_PRODUCTS,
	UPDATE_FILTERS,
	FILTER_PRODUCTS,
	CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
	switch (action.type) {
		case LOAD_PRODUCTS: {
			let maxPrice = action.payload.map((product) => product.price);
			maxPrice = Math.max(...maxPrice);
			return {
				...state,
				allProducts: [...action.payload],
				filteredProducts: [...action.payload],
				filters: { ...state.filters, maxPrice: maxPrice, price: maxPrice },
			};
		}
		case SET_GRIDVIEW: {
			return {
				...state,
				gridView: true,
			};
		}
		case SET_LISTVIEW: {
			return {
				...state,
				gridView: false,
			};
		}
		case UPDATE_SORT: {
			return { ...state, sort: action.payload };
		}
		case SORT_PRODUCTS: {
			let sorted = [...state.filteredProducts];
			if (action.payload === "price-highest") {
				sorted = sorted.sort((a, b) => {
					return b.price - a.price;
				});
			} else if (action.payload === "price-lowest") {
				sorted = sorted.sort((a, b) => {
					return a.price - b.price;
				});
			} else if (action.payload === "name-a") {
				sorted = sorted.sort((a, b) => {
					return a.name.localeCompare(b.name);
				});
			} else if (action.payload === "name-z") {
				sorted = sorted.sort((a, b) => {
					return b.name.localeCompare(a.name);
				});
			}
			// return state;
			return { ...state, filteredProducts: sorted };
		}
		case FILTER_PRODUCTS: {
			let filtered = state.allProducts;
			const filtersState = state.filters;
			const {
				text,
				company,
				category,
				color,
				minPrice,
				maxPrice,
				price,
				shipping,
			} = filtersState;
			filtered = filtered.filter((product) => {
				return product.name.indexOf(text) === 0;
			});
			if (category !== "all") {
				filtered = filtered.filter((product) => {
					return product.category === category;
				});
			}
			if (company !== "all") {
				filtered = filtered.filter((product) => {
					return product.company === company;
				});
			}
			if (color !== "all") {
				filtered = filtered.filter((product) => {
					return product.colors.indexOf(color) !== -1;
				});
			}
			filtered = filtered.filter((product) => {
				// console.log(product.price < price);
				return product.price <= price;
			});
			if (shipping) {
				filtered = filtered.filter((product) => {
					return product.shipping;
				});
			}

			return { ...state, filteredProducts: filtered };
			// else {
			// 	return { ...state, filteredProducts: filtered };
			// }
		}
		case UPDATE_FILTERS: {
			const { name, value } = action.payload;

			return {
				...state,
				filters: { ...state.filters, [name]: value },
			};
		}
		case CLEAR_FILTERS: {
			return {
				...state,
				filteredProducts: state.allProducts,
				filters: {
					text: "",
					company: "all",
					category: "all",
					color: "all",
					minPrice: 0,
					maxPrice: state.filters.maxPrice,
					price: state.filters.maxPrice,
					shipping: false,
				},
			};
		}
	}
	throw new Error(`No Matching "${action.type}" - action type`);

	return state;
};

export default filter_reducer;
