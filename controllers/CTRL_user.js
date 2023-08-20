import { writeFileSync } from 'fs';
import { createRequire } from "module";
import { validationResult } from 'express-validator';
import { unlink } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));


const require = createRequire(import.meta.url);
const DB_user = require('../DB/DB_user.json');
import setImage from '../utils/setImage.js';


const defaultAvatar = resolve(__dirname, '../static/default_user.png');



export const data = (req, res) => {
	try {
		let data = DB_user;

		return res.status(200).json({ success: true, data })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}


export const edit = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, massage: 'ошибка валидации', errors: errors.array() });
		const { lang, born } = req.body;
		const DB = { ...DB_user };
		const keys = ['username', 'live', 'mainText', 'description'];
		// avatar
		const { path, error } = setImage(req?.files?.avatar);
		if (req?.files?.avatar && error) return res.status(400).json({ success: false, message: "Изображение не прошло валидацию", error })
		if (req?.files?.avatar && !error && DB?.avatar && DB?.avatar !== defaultAvatar) {
			unlink(DB?.avatar, err => {
				if (err) throw err; // не удалось удалить файл
				console.log('Файл успешно удалён');
			});
		}
		if (req?.files?.avatar && path) DB.avatar = path;
		// born
		let born_unix = Date.parse(new Date(Number(born)));
		if (born && born_unix) DB.born = born_unix;
		if (born && !born_unix) return res.status(400).json({ success: false, message: "Ключ date не прошел валидацию, передайте unix date" });
		// keys
		if (!DB[lang]) {
			DB[lang] = {
				username: "",
				live: "",
				mainText: "",
				description: ""
			}
		};
		for (let item in req.body) {
			keys.find(key => key === item) && (
				DB[lang][item] = req.body[item]
			);
		}
		//  result
		writeFileSync(resolve(__dirname, '../DB/DB_user.json'), JSON.stringify(DB))
		return res.status(200).json({ success: true, data: DB })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}



export const removeAvatar = (req, res) => {
	try {
		const DB = { ...DB_user };
		if (DB?.avatar && DB?.avatar !== defaultAvatar) {
			unlink(DB.avatar, err => {
				if (err) throw err; // не удалось удалить файл
				console.log('Файл успешно удалён');
			});
			DB.avatar = defaultAvatar;
		}

		writeFileSync(resolve(__dirname, '../DB/DB_user.json'), JSON.stringify(DB))
		return res.status(200).json({ success: true, data: { defaultAvatar } })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}
