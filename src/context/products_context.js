import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import reducer from "../reducers/products_reducer";
import { products_url as url } from "../utils/constants";
import {
	SIDEBAR_OPEN,
	SIDEBAR_CLOSE,
	GET_PRODUCTS_BEGIN,
	GET_PRODUCTS_SUCCESS,
	GET_PRODUCTS_ERROR,
	GET_SINGLE_PRODUCT_BEGIN,
	GET_SINGLE_PRODUCT_SUCCESS,
	GET_SINGLE_PRODUCT_ERROR,
} from "../actions";

const initialState = {
	isSidebarOpen: false,
	productsLoading: false,
	products: [],
	featuredProducts: [],
	productsError: false,
	singleProductLoading: false,
	singleProduct: [],
	singleProductError: false,
};

const ProductsContext = React.createContext();

export const ProductsProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	useEffect(() => {
		getProducts(url);
	}, []);
	const getProducts = async (url) => {
		dispatch({ type: GET_PRODUCTS_BEGIN });
		try {
			const resp = await axios(url);
			const products = resp.data;
			dispatch({ type: GET_PRODUCTS_SUCCESS, payload: products });
		} catch (error) {
			dispatch({ type: GET_PRODUCTS_ERROR });
		}
	};

	const getSingleProduct = async (url) => {
		dispatch({ type: GET_SINGLE_PRODUCT_BEGIN });
		try {
			const resp = await axios(url);
			const singleProduct = resp.data;
			dispatch({ type: GET_SINGLE_PRODUCT_SUCCESS, payload: singleProduct });
		} catch (error) {
			console.log(error);
			dispatch({ type: GET_SINGLE_PRODUCT_ERROR });
		}
	};
	const openSidebar = () => {
		dispatch({ type: SIDEBAR_OPEN });
	};
	const closeSidebar = () => {
		dispatch({ type: SIDEBAR_CLOSE });
	};
	return (
		<ProductsContext.Provider
			value={{ ...state, openSidebar, closeSidebar, getSingleProduct }}>
			{children}
		</ProductsContext.Provider>
	);
};
// make sure use
export const useProductsContext = () => {
	return useContext(ProductsContext);
};
