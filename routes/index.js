import express from 'express';
const app = express();


import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));



// routes
import routesAPI from './Route_API.js';

app.get('/', (req, res) => {
	res.sendfile(resolve(__dirname, '../front-end/index.html'))
})


// use routes
app.use(routesAPI) // api Routes


export default app;