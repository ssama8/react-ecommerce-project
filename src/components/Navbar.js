import React from "react";
import styled from "styled-components";
import sportsLogo from "../assets/sportsLogo.svg";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { links } from "../utils/constants";
import CartButtons from "./CartButtons";
import { useProductsContext } from "../context/products_context";
import { useUserContext } from "../context/user_context";
const Nav = () => {
	const { myUser } = useUserContext();
	// console.log(props);
	const { openSidebar } = useProductsContext();
	console.log(myUser);
	return (
		<NavContainer>
			<div className='nav-center'>
				<div className='nav-header'>
					<Link to='/' className='app-logo'>
						<img src={sportsLogo} alt='comfy-sloth' />
					</Link>
					<button type='button' className='nav-toggle'>
						<FaBars onClick={() => openSidebar()} />
					</button>
				</div>
				<ul className='nav-links'>
					{links.map((link) => {
						const { id, text, url } = link;
						return (
							<li key={id}>
								<Link to={url}>{text}</Link>
							</li>
						);
					})}
					{myUser && (
						<li>
							<Link to='/checkout'>Chekout</Link>
						</li>
					)}
				</ul>
				<CartButtons />
			</div>
		</NavContainer>
	);
};

const NavContainer = styled.nav`
	height: 5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #555;
	.nav-center {
		width: 90vw;
		margin: 0 auto;
		max-width: var(--max-width);
	}
	@media screen and (max-width: 550px) {
		.app-logo {
			display: none;
		}
	}
	.nav-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		img {
			background-color: #555;
			// transform: scale(1, 0.4);
			margin-left: -15px;
			background-color: green;
		}
	}
	.nav-toggle {
		background: transparent;
		border: transparent;
		position: absolute;
		right: 5px;
		cursor: pointer;
		z-index: 100;
		color: var(--clr-primary-5);
		cursor: pointer;
		svg {
			font-size: 2rem;
		}
	}
	.nav-links {
		display: none;
	}
	.nav-links li a {
		color: white;
		font-weight: bold;
	}
	.nav-links li a:hover {
		color: orange;
	}
	.cart-btn-wrapper {
		display: none;
	}
	@media (min-width: 992px) {
		.nav-toggle {
			display: none;
		}
		.nav-center {
			display: grid;
			grid-template-columns: auto 1fr auto;
			align-items: center;
		}
		.nav-links {
			display: flex;
			justify-content: center;
			li {
				margin: 0 0.5rem;
			}
			a {
				color: var(--clr-grey-3);
				font-size: 1rem;
				text-transform: capitalize;
				letter-spacing: var(--spacing);
				padding: 0.5rem;
				&:hover {
					border-bottom: 2px solid var(--clr-primary-7);
				}
			}
		}
		.cart-btn-wrapper {
			display: grid;
		}
	}
`;

export default Nav;
