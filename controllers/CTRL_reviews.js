import { writeFileSync } from 'fs';
import { createRequire } from "module";
import { validationResult } from 'express-validator';
import { unlink } from 'fs';
import { v4 as setId } from 'uuid';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));


const require = createRequire(import.meta.url);
const DB_reviews = require('../DB/DB_reviews.json');
import setImage from '../utils/setImage.js';

const defaultAvatar = resolve(__dirname, '../static/default_user.png');



export const data = (req, res) => {
	try {
		let data = DB_reviews;

		return res.status(200).json({ success: true, data })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}


export const add = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, massage: 'Ошибка валидации', errors });
		const { lang, name, job, review } = req.body;
		const DB = { ...DB_reviews };
		if (!Array.isArray(DB[lang])) DB[lang] = [];

		const data = {
			id: `review-${lang}-${setId()}`,
			name, job, review,
			avatar: defaultAvatar
		};
		// avatar
		console.log(req?.files)
		const { path, error } = setImage(req?.files?.avatar);
		if (req?.files?.avatar && error) return res.status(400).json({ success: false, message: "Изображение не прошло валидацию", error })
		if (req?.files?.avatar && path) data.avatar = path;
		// add item
		DB[lang].unshift(data);
		writeFileSync(resolve(__dirname, '../', 'DB/DB_reviews.json'), JSON.stringify(DB))
		// result
		return res.status(200).json({ success: true, data })
	} catch (error) {
		console.log(error);
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}



export const edit = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, massage: 'ошибка валидации', errors: errors.array() });
		const { lang, id } = req.body;
		const DB = { ...DB_reviews };
		const keys = ['name', 'job', 'review'];

		const findItem = DB[lang]?.find(item => item.id === id);
		if (!findItem) return res.status(400).json({ success: false, message: 'Элемент не найден' });
		for (let item in req.body) {
			keys.find(key => key === item) && (
				findItem[item] = req.body[item]
			);
		}
		// avatar
		const { path, error } = setImage(req?.files?.avatar);
		if (req?.files?.avatar && error) return res.status(400).json({ success: false, message: "Изображение не прошло валидацию", error })
		if (req?.files?.avatar && path && findItem.avatar !== defaultAvatar) {
			unlink(findItem.avatar, err => {
				if (err) throw err; // не удалось удалить файл
				console.log('Файл успешно удалён');
			});
		}
		if (req?.files?.avatar && path) findItem.avatar = path;
		// result
		writeFileSync(resolve(__dirname, '../', 'DB/DB_reviews.json'), JSON.stringify(DB))
		return res.status(200).json({ success: true, data: findItem })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}


export const remove = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, massage: 'ошибка валидации', errors: errors.array() });
		const { lang, id } = req.query;
		const DB = { ...DB_reviews };

		let findItem = DB[lang]?.find(item => item.id === id);
		if (!findItem) return res.status(400).json({ success: false, message: 'Элемент не найден' });
		const filtered = DB[lang].filter(item => item.id !== id);
		DB[lang] = filtered;
		// delete image
		if (findItem.avatar !== defaultAvatar) {
			unlink(findItem.avatar, err => {
				if (err) throw err; // не удалось удалить файл
				console.log('Файл успешно удалён');
			});
		}
		// result 
		writeFileSync(resolve(__dirname, '../', 'DB/DB_reviews.json'), JSON.stringify(DB))
		return res.status(200).json({ success: true, message: 'Успешно удалено' })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}



export const removeAvatar = (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, massage: 'ошибка валидации', errors: errors.array() });
		const { lang, id } = req.query;
		const DB = { ...DB_reviews };

		let findItem = DB[lang]?.find(item => item.id === id);
		if (!findItem) return res.status(400).json({ success: false, message: 'Элемент не найден' });

		// delete image
		if (findItem.avatar !== defaultAvatar) {
			unlink(findItem.avatar, err => {
				if (err) throw err; // не удалось удалить файл
				console.log('Файл успешно удалён');
			});
			findItem.avatar = defaultAvatar;
		}
		// result
		writeFileSync(resolve(__dirname, '../', 'DB/DB_user.json'), JSON.stringify(DB))
		return res.status(200).json({ success: true, data: findItem })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}
