## Router

This app uses react-router to navigate between the different pages of the site. There are paths to the home page, about page, products page, cart page, and the single product page. The chechout page however is a private route hidden to anybody that has not been authenticated or logged in, which prevents them from paying. The navbar and footer are on every page. There is also an error page if someone navigates to a url not specified in the router. Every page also has a section below the navbar that has links to past pages.

## Home Page

The home page is a hub for everything in the app, and doesn't have much logic. When the page loads a Showcase or Hero pops up with a link to the product page to shop. Theres a featured products component that maps through the array of products received by the get request and finds the ones that have a feautured key. If there are more than the 3, then it picks any random 3 from the list of products. Theres a services component that shows off some cool styles as the little boxes scale and change color on hover. Theres also a newsletter that users can subscribe to.

## About Page

Like the home page, the about page doesn't have much logic. It's a neatly displayed section that has an image on one side and text on the other.

## Products Page

The products page has a lot of logic and a plethora of components. It takes the data fecthed on mount and organizes it in a grid or list view depending on what the user chooses. There are also filters that the user can use to find products they are looking for.

On the very right of the page theres a sort by dropdown that allows the user to sort by the price and name. This is done by using useContext and useReducer to dispatch certain actions when a different sort is selected.

The filtering is completely dynamic so you can integrate any api with the app as long as you have category, and company keys. The Unique Values in the utils folder gets all the different categories and companies from the api. Theres also a neat price slider that shows products below a certain price.

## Single Product Page

The single product page shows if the item is in stock, the customer reviews, the brand, sku, colors, and has a toggle functionality where you can add and subtract the amount as long as the numbers not greater than the stock. All of this data is received from the api onmount using useeffect and stored in the context so that the props are passed down the component tree. Is there are no items in stock you can't add to cart.

## The Cart Page

The cart page displays the color and the amount of a certain item. You can toggle the quantity or delete a certain item. There is also a cartTotals component that displays the total price passed down from the products context and a dynamic button that either navigates you to the login page if you aren't already logged in or to the checkout page where you purchase the item.

## Checkout Page

Integrated with Stripe the checkout page also has the cartItem component to display the amount of a certain item but also has a card component where the user can submit their credit card info. The button will only be clickable if the card is valid and that's when the serverless netlify function communicates with stripe as a middleman to make the app more secure. If there is a client secret in the token then the payment goes through if not then there's an error and no payment is made.
