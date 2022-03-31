import React from "react";
const Error = ({ error }) => {
	return (
		<div className='section section-center text-center page-100'>
			<h2>there was an error{error && error}...</h2>
		</div>
	);
};

export default Error;
