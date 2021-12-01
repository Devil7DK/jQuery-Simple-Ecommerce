/**
 * @typedef {object} Product
 * @property {number} id ID of the product
 * @property {string} product_name Name of the product
 * @property {number} price Price of the product
 */

/**
 * @typedef {object} ProductsResponse
 * @property {Array<Product>} items List of products
 * @property {number} total Total number of products
 */

/**
 * @typedef {object} CartItem
 * @property {Product} product Product linked with cart item
 * @property {number} count Cart item count
 */

/**
 * @typedef {Map<number, CartItem>} CartItems
 */
