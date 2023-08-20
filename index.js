import express from 'express';
import morgan from 'morgan';
import cors from "cors"
import * as dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// routes
import routes from './routes/index.js'

// vars
const env = dotenv.config().parsed;
const app = express();
const PORT = env.PORT || 2020;

// middlewars
app.use(cors());
app.use(fileUpload()); //позволяет получать formData в запросах
app.use(express.json()); // позволяет читать json в запросах
app.use(express.urlencoded({ extended: true }));
app.use(morgan(':method :url :status :res[content-length] :response-time ms')); // выведение в консоль всех запросов
app.use('/', express.static(resolve(__dirname))); // путь для всех элементов
app.use(routes) // use Routes API

app.use((req, res) => {
	res.sendfile(resolve(__dirname, 'index.html'))
})




// start server
app.listen(PORT, (err) => {
	if (err) return console.log(err);
	console.log('server started')
	console.log(`link: http://localhost:${PORT}`)
})