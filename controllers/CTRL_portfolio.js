import { writeFileSync } from 'fs';
import { createRequire } from "module";
import { validationResult } from 'express-validator';
import { unlink } from 'fs';
import { v4 as setId } from 'uuid';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);
const DB_portfolio = require('../DB/DB_portfolio.json');
import setImage from '../utils/setImage.js';



export const data = (req, res) => {
	try {
		let data = DB_portfolio;

		return res.status(200).json({ success: true, data })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}


export const add = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, massage: 'Ошибка валидации', errors });
		const { lang, links, tags, description, name } = req.body;
		const DB = { ...DB_portfolio };
		if (!DB[lang]) DB[lang] = [];

		let obj = {
			id: `portfolio-${lang}-${setId()}`,
			image: null,
			description, name,
			links: JSON.parse(links),
			tags: JSON.parse(tags),
		}

		// image
		const file = req?.files?.image;
		const { path, error } = setImage(file);
		if (file && error) return res.status(400).json({ success: false, message: "Изображение не прошло валидацию", error })
		if (file && path) obj.image = path;
		// result
		DB[lang].unshift(obj);
		writeFileSync(resolve(__dirname, '../', 'DB/DB_portfolio.json'), JSON.stringify(DB))
		return res.status(200).json({ success: true, data: obj })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}


export const edit = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, massage: 'ошибка валидации', errors: errors.array() });
		const { lang, id, links, tags, description, name } = req.body;
		const file = req?.files?.image;
		const DB = { ...DB_portfolio };
		const findItem = DB[lang].find(item => item.id === id);
		if (!findItem) return res.status(400).json({ success: false, message: 'Элемент не найден' });
		// keys
		if (description) findItem.description = description;
		if (name) findItem.name = name;
		if (links) findItem.links = JSON.parse(links);
		if (tags) findItem.tags = JSON.parse(tags);
		// image
		const { path, error } = setImage(file);
		if (file && error) return res.status(400).json({ success: false, message: "Изображение не прошло валидацию", error })
		if (file && path && findItem?.image) {
			unlink(findItem.image, err => {
				if (err) throw err; // не удалось удалить файл
				console.log('Файл успешно удалён');
			});
		}
		if (file && path) findItem.image = path;
		// result
		writeFileSync(resolve(__dirname, '../', 'DB/DB_portfolio.json'), JSON.stringify(DB))
		return res.status(200).json({ success: true, data: findItem })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}


export const remove = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, massage: 'ошибка валидации', errors: errors.array() });
		const { lang, id } = req.query;
		const DB = { ...DB_portfolio };
		const findItem = DB[lang].find(item => item.id === id);
		if (!findItem) return res.status(400).json({ success: false, message: 'Элемент не найден' });

		const filtered = DB[lang].filter(item => item.id !== id);
		DB[lang] = filtered;
		// delete image
		if (findItem?.image) {
			unlink(findItem.image, err => {
				if (err) throw err; // не удалось удалить файл
				console.log('Файл успешно удалён');
			});
		}
		// result
		writeFileSync(resolve(__dirname, '../', 'DB/DB_portfolio.json'), JSON.stringify(DB))
		return res.status(200).json({ success: true, message: 'Успешно удалено' })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}



