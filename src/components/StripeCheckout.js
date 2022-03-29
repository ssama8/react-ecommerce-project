import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import {
	CardElement,
	useStripe,
	Elements,
	useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import CartColumns from "./CartColumns";
import { useCartContext } from "../context/cart_context";
import { useUserContext } from "../context/user_context";
import { formatPrice } from "../utils/helpers";
import { useNavigate } from "react-router-dom";

const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
const cardStyle = {
	style: {
		base: {
			color: "#32325d",
			fontFamily: "Arial, sans-serif",
			fontSmoothing: "antialiased",
			fontSize: "16px",
			"::placeholder": {
				color: "#32325d",
			},
		},
		invalid: {
			color: "#fa755a",
			iconColor: "#fa755a",
		},
	},
};
const CheckoutForm = () => {
	const { cart, totalAmount, shippingFee, clearCart } = useCartContext();
	const { myUser } = useUserContext();
	const navigate = useNavigate();

	const [succeeded, setSucceesed] = useState(false);
	const [error, setError] = useState(null);
	const [processing, setProcessing] = useState("");

	const [disabled, setDisabled] = useState(true);

	const [clientSecret, setClientSecret] = useState("");
	const stripe = useStripe();
	const elements = useElements();
	const createPaymentIntent = async () => {
		try {
			const { data } = await axios.post(
				"/.netlify/functions/create-payment-intent",
				JSON.stringify({ cart, shippingFee, totalAmount })
			);

			console.log(data.clientSecret);
			setClientSecret(data.clientSecret);
		} catch (err) {
			console.log(err.response);
		}
	};

	useEffect(() => {
		createPaymentIntent();
	}, [cart]);

	const handleChange = async (event) => {
		setDisabled(event.empty);
		setError(event.error ? event.error.message : "");
	};

	const handleSubmit = async (ev) => {
		ev.preventDefault();
		setProcessing(true);
		const payload = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement),
			},
		});
		if (payload.error) {
			setError(`Payment failed ${payload.error.message}`);
			setProcessing(false);
		} else {
			setError(null);
			setProcessing(false);
			setSucceesed(true);
			setTimeout(() => {
				clearCart();
				navigate("/");
			}, 10000);
		}
	};
	// copyToClipboard = (e) => {};

	return (
		<div>
			{succeeded ? (
				<article>
					<h4>Thank you</h4>
					<h4>Your payment was successful!</h4>
					<h4> Automatically Redirecting to home page in 10s</h4>
				</article>
			) : (
				<article>
					<h5>Hello, {myUser && myUser.nickname}</h5>
					<h5>Your total is {formatPrice(shippingFee + totalAmount)}</h5>
					<p>
						Test CardNumber : <span>4242 4242 4242 4242</span>
					</p>
				</article>
			)}

			{!succeeded && <CartColumns />}
			{!succeeded &&
				cart.map((item) => {
					const { amount, color, image, name, price } = item;
					return (
						<CartItem
							key={item.id}
							{...item}
							checkout={true}
							className='cart-item'
						/>
					);
				})}

			<form id='payment-form' onSubmit={handleSubmit} className='centered'>
				<CardElement
					id='card-element'
					options={cardStyle}
					onChange={handleChange}
				/>
				<button disabled={processing || disabled || succeeded} id='submit'>
					<span id='button-text'>
						{processing ? <div className='spinner' id='spinnier'></div> : "Pay"}
					</span>
				</button>
				{/* Show any error that happens when processing the payment */}
				{error && (
					<div className='card-error' role='alert'>
						{error}
					</div>
				)}
				{/* Show  a success message upon completion */}
				<p className={succeeded ? "result-message" : "result-message hidden"}>
					Payment succedded, see the result in your
					<a
						href={`https://dashboard.stripe.com/test/payments`}
						target='_blank'>
						Stripe dasboard.
					</a>
					Refresh the page to pay again
				</p>
			</form>
			<Link className='btn' to='/products'>
				Change CartItems
			</Link>
		</div>
	);
};

const StripeCheckout = () => {
	const { cart } = useCartContext();
	return (
		<Wrapper className='checkout-section'>
			{/* <CartContent /> */}

			<Elements stripe={promise}>
				<CheckoutForm />
			</Elements>
		</Wrapper>
	);
};

export default StripeCheckout;

const Wrapper = styled.section`
	text-align: center;
	form {
		width: 30vw;
		align-self: center;
		box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
			0px 2px 5px 0px rgba(50, 50, 93, 0.1),
			0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
		border-radius: 7px;
		padding: 40px;
	}
	a {
		margin: 2rem 0;
	}
	span:hover {
		cursor: pointer;
	}
	input {
		border-radius: 6px;
		margin-bottom: 6px;
		padding: 12px;
		border: 1px solid rgba(50, 50, 93, 0.1);
		max-height: 44px;
		font-size: 16px;
		width: 100%;
		background: white;
		box-sizing: border-box;
	}
	.result-message {
		line-height: 22px;
		font-size: 16px;
	}
	.result-message a {
		color: rgb(89, 111, 214);
		font-weight: 600;
		text-decoration: none;
	}
	.hidden {
		display: none;
	}
	#card-error {
		color: rgb(105, 115, 134);
		font-size: 16px;
		line-height: 20px;
		margin-top: 12px;
		text-align: center;
	}
	#card-element {
		border-radius: 4px 4px 0 0;
		padding: 12px;
		border: 1px solid rgba(50, 50, 93, 0.1);
		max-height: 44px;
		width: 100%;
		background: white;
		box-sizing: border-box;
	}
	article {
		margin-bottom: 1rem;
	}

	#payment-request-button {
		margin-bottom: 32px;
	}
	/* Buttons and links */
	button {
		background: #5469d4;
		font-family: Arial, sans-serif;
		color: #ffffff;
		border-radius: 0 0 4px 4px;
		border: 0;
		padding: 12px 16px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		display: block;
		transition: all 0.2s ease;
		box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
		width: 100%;
	}
	button:hover {
		filter: contrast(115%);
	}
	button:disabled {
		opacity: 0.5;
		cursor: default;
	}
	/* spinner/processing state, errors */
	.spinner,
	.spinner:before,
	.spinner:after {
		border-radius: 50%;
	}
	.spinner {
		color: #ffffff;
		font-size: 22px;
		text-indent: -99999px;
		margin: 0px auto;
		position: relative;
		width: 20px;
		height: 20px;
		box-shadow: inset 0 0 0 2px;
		-webkit-transform: translateZ(0);
		-ms-transform: translateZ(0);
		transform: translateZ(0);
	}
	.spinner:before,
	.spinner:after {
		position: absolute;
		content: "";
	}
	.spinner:before {
		width: 10.4px;
		height: 20.4px;
		background: #5469d4;
		border-radius: 20.4px 0 0 20.4px;
		top: -0.2px;
		left: -0.2px;
		-webkit-transform-origin: 10.4px 10.2px;
		transform-origin: 10.4px 10.2px;
		-webkit-animation: loading 2s infinite ease 1.5s;
		animation: loading 2s infinite ease 1.5s;
	}
	.spinner:after {
		width: 10.4px;
		height: 10.2px;
		background: #5469d4;
		border-radius: 0 10.2px 10.2px 0;
		top: -0.1px;
		left: 10.2px;
		-webkit-transform-origin: 0px 10.2px;
		transform-origin: 0px 10.2px;
		-webkit-animation: loading 2s infinite ease;
		animation: loading 2s infinite ease;
	}
	@keyframes loading {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
	@media only screen and (max-width: 1100px) {
		form {
			width: 40vw;
		}
	}
	@media only screen and (max-width: 800px) {
		form {
			width: 60vw;
		}
	}
	@media only screen and (max-width: 600px) {
		form {
			width: 80vw;
		}
	}
	@media only screen and (max-width: 400px) {
		form {
			width: 100vw;
		}
	}
`;
