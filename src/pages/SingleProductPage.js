import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductsContext } from "../context/products_context";
import { single_product_url as url } from "../utils/constants";
import { formatPrice } from "../utils/helpers";
import {
	Loading,
	Error,
	ProductImages,
	AddToCart,
	Stars,
	PageHero,
} from "../components";
import styled from "styled-components";
import { Link } from "react-router-dom";

const SingleProductPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [amount, setAmount] = useState(1);

	const {
		singleProductLoading: loading,
		singleProductError: error,
		singleProduct: product,
		getSingleProduct,
	} = useProductsContext();
	useEffect(() => {
		getSingleProduct(`${url}${id}`);
	}, []);
	useEffect(() => {
		if (error) {
			setTimeout(() => {
				navigate("/");
			}, 3000);
		}
	}, [error]);
	if (loading) {
		return <Loading />;
	}
	if (error) {
		return <Error />;
	}
	const {
		name,
		price,
		description,
		stock,
		stars,
		reviews,
		id: sku,
		company,
		images,
	} = product;
	console.log(loading);
	return (
		<Wrapper>
			<PageHero title={"products"} product={name} />
			<div className='section section-center page'>
				<Link to='/products' className='btn'>
					back to products
				</Link>
				<div className='product-center'>
					<ProductImages images={images} />
					<section className='content'>
						<h2>{name}</h2>
						<Stars stars={stars} reviews={reviews} />
						<h5 className='price'> {formatPrice(price)}</h5>
						<p className='desc'>{description}</p>
						<p className='info'>
							<span>Available : </span>
							{stock > 0 ? `In stock (${stock - amount})` : "out of stock"}
						</p>
						<p className='info'>
							<span>Sku : </span>
							{sku}
						</p>
						<p className='info'>
							<span>Brand : </span>
							{company}
						</p>
						<hr />
						{stock > 0 && (
							<AddToCart {...product} current={amount} setCurrent={setAmount} />
						)}
					</section>
				</div>
			</div>
		</Wrapper>
	);
};

const Wrapper = styled.main`
	.product-center {
		display: grid;
		gap: 4rem;
		margin-top: 2rem;
	}
	.price {
		color: var(--clr-primary-5);
	}
	.desc {
		line-height: 2;
		max-width: 45em;
	}
	.info {
		text-transform: capitalize;
		width: 300px;
		display: grid;
		grid-template-columns: 125px 1fr;
		span {
			font-weight: 700;
		}
	}

	@media (min-width: 992px) {
		.product-center {
			grid-template-columns: 1fr 1fr;
			align-items: center;
		}
		.price {
			font-size: 1.25rem;
		}
	}
`;

export default SingleProductPage;
