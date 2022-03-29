import {
	ADD_TO_CART,
	CLEAR_CART,
	COUNT_CART_TOTALS,
	REMOVE_CART_ITEM,
	TOGGLE_CART_ITEM_AMOUNT,
} from "../actions";

const cart_reducer = (state, action) => {
	switch (action.type) {
		case ADD_TO_CART: {
			const { id, color, amount, product } = action.payload;
			console.log(product);
			const tempItem = state.cart.find((item) => item.id === id + color);
			if (tempItem) {
				const cartItems = [...state.cart];
				let index = cartItems.indexOf(tempItem);
				cartItems[index].amount += amount;
				if (cartItems[index].amount > cartItems[index].max) {
					cartItems[index].amount = cartItems[index].max;
				}
				return { ...state, cart: cartItems };
			} else {
				return {
					...state,
					cart: [
						...state.cart,
						{
							id: id + color,
							color: color,
							amount: amount,
							max: product.stock,
							price: product.price,
							image: product.images[0].url,
							name: product.name,
						},
					],
				};
			}
		}
		case CLEAR_CART: {
			return { ...state, cart: [] };
		}
		case REMOVE_CART_ITEM: {
			const tempCart = state.cart.filter((item) => item.id !== action.payload);

			return { ...state, cart: tempCart };
		}
		case TOGGLE_CART_ITEM_AMOUNT: {
			const { id, value } = action.payload;
			const newCart = [...state.cart];
			const tempCartItem = newCart.find((item) => item.id == id);
			tempCartItem.amount += value;
			if (tempCartItem.amount > tempCartItem.max) {
				tempCartItem.amount = tempCartItem.max;
			} else if (tempCartItem.amount === 0) {
				tempCartItem.amount = 1;
			}

			return { ...state, cart: newCart };
		}
		case COUNT_CART_TOTALS: {
			const { totalItems, totalAmount } = state.cart.reduce(
				(total, item) => {
					total.totalItems += item.amount;
					total.totalAmount += item.amount * item.price;
					return total;
				},
				{
					totalItems: 0,
					totalAmount: 0,
				}
			);
			return { ...state, totalItems, totalAmount };
		}
	}
	return state;
	throw new Error(`No Matching "${action.type}" - action type`);
};

export default cart_reducer;
