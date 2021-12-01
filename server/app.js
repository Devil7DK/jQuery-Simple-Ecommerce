import express from 'express';
import { resolve } from 'path';

import { productsController } from './products.js';

const app = express();

app.use('/products', productsController);

app.use(express.static(resolve(process.cwd(), 'public')));

app.listen(4001, () => {
    console.log("Server started on port 4001");
});
