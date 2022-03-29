require("dotenv").config();

const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
	if (!event.body) {
		return {
			statusCode: 200,
			body: "Create payment intent",
		};
	}
	const { cart, shippingFee, totalAmount } = JSON.parse(event.body);

	const calculateTotalCost = () => {
		return shippingFee + totalAmount;
	};
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: calculateTotalCost(),
			currency: "usd",
		});
		return {
			statusCode: 200,
			body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ message: error.message }),
		};
	}
};
