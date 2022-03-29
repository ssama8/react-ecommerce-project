import React, { useState } from "react";
import styled from "styled-components";
import { formatPrice } from "../utils/helpers";
import { Link } from "react-router-dom";
const ListView = ({ products }) => {
	const [descriptionLength, setDescriptionLength] = useState(
		Array.from(products, () => {
			return "short";
		})
	);
	return (
		<Wrapper>
			{products.map((product, index) => {
				const { id, image, name, price, description } = product;

				return (
					<article key={id}>
						<img src={image} alt={name} />
						<div>
							<h4>{name}</h4>
							<h5 className='price'>{formatPrice(price)}</h5>
							<p className={descriptionLength[index]} id={name}>
								{descriptionLength[index] === "short"
									? description.substring(0, 150)
									: description}
								...
								<button
									type='button'
									className='btn-read'
									onClick={(e) => {
										const newDescriptions = [...descriptionLength];
										const currentClass = newDescriptions[index];
										newDescriptions.splice(
											index,
											1,
											currentClass === "short" ? "long" : "short"
										);
										console.log(newDescriptions);
										setDescriptionLength(newDescriptions);
									}}>
									{" "}
									{descriptionLength[index] === "short"
										? "Read More"
										: "Read Less"}
								</button>
							</p>
							<Link to={`/products/${id}`} className='btn'>
								details
							</Link>
						</div>
					</article>
				);
			})}
		</Wrapper>
	);
};

const Wrapper = styled.section`
	display: grid;
	row-gap: 3rem;

	img {
		width: 100%;
		display: block;
		width: 300px;
		height: 200px;
		object-fit: cover;
		border-radius: var(--radius);
		margin-bottom: 1rem;
	}
	h4 {
		margin-bottom: 0.5rem;
	}
	.price {
		color: var(--clr-primary-6);
		margin-bottom: 0.75rem;
	}
	p {
		max-width: 45em;
		margin-bottom: 1rem;
	}
	.btn {
		font-size: 0.5rem;
		padding: 0.25rem 0.5rem;
	}
	.btn-read {
		background: none;
		border: none;
		cursor: pointer;
		color: purple;
	}
	@media (min-width: 992px) {
		article {
			display: grid;
			grid-template-columns: auto 1fr;
			column-gap: 2rem;
			align-items: center;
		}
	}
`;

export default ListView;
