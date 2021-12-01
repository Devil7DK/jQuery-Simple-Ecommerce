import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * @typedef {object} Product
 * @property {number} id ID of the product
 * @property {string} product_name Name of the product
 * @property {number} price Price of the product
 */

/**
 * @type {Array<Product>}
 */
const products = JSON.parse(readFileSync(resolve('data/products.json')));

/**
 * @type {import('express').RequestHandler}
 */
export const productsController = (req, res) => {
    const startAt = req.query['startAt'] || 0;
    const limit = req.query['limit'] || 20;

    res.send({
        items: products.slice(startAt, startAt + limit),
        total: products.length,
    });
};
