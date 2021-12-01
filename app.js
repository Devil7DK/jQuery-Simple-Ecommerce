import express from 'express';
import { resolve } from 'path';

const app = express();

app.use(express.static(resolve(process.cwd(), 'public')));

app.listen(4001, () => {
    console.log("Server started on port 4001");
});
