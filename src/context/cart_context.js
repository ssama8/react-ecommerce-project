import React, { useEffect, useContext, useReducer } from "react";
import reducer from "../reducers/cart_reducer";
import {
	ADD_TO_CART,
	REMOVE_CART_ITEM,
	TOGGLE_CART_ITEM_AMOUNT,
	CLEAR_CART,
	COUNT_CART_TOTALS,
} from "../actions";
const getFromLocalStorage = () => {
	const items = JSON.parse(localStorage.getItem("cartItems"));
	if (items) {
		return items;
	} else {
		return [];
	}
};
const initialState = {
	cart: getFromLocalStorage(),
	totalItems: 0,
	totalAmount: 0,
	shippingFee: 721,
};

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const addToCart = (id, color, amount, product) => {
		console.log(id, color, amount, product);
		dispatch({
			type: ADD_TO_CART,
			payload: { id, color, amount, product },
		});
	};

	useEffect(() => {
		dispatch({ type: COUNT_CART_TOTALS });

		localStorage.setItem("cartItems", JSON.stringify(state.cart));
	}, [state.cart]);

	const removeItem = (id) => {
		dispatch({ type: REMOVE_CART_ITEM, payload: id });
	};
	const changeAmount = (id, value) => {
		dispatch({ type: TOGGLE_CART_ITEM_AMOUNT, payload: { id, value } });
	};
	const clearCart = () => {
		dispatch({ type: CLEAR_CART });
	};
	return (
		<CartContext.Provider
			value={{ ...state, addToCart, removeItem, changeAmount, clearCart }}>
			{children}
		</CartContext.Provider>
	);
};
// make sure use
export const useCartContext = () => {
	return useContext(CartContext);
};
