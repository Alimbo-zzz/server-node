import { createRequire } from "module";
import { validationResult } from 'express-validator';
import { unlink, unlinkSync, readFileSync, writeFileSync, createReadStream, createWriteStream } from 'fs';
import { v4 as setId } from 'uuid';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);
const DB_skills = require('../DB/DB_skills.json');
import setImage from '../utils/setImage.js';
const SvgFill = require('svg-fill').default;
const iconColor = '#ffffff';



export const data = (req, res) => {
	try {
		let data = DB_skills;

		return res.status(200).json({ success: true, data })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}

function deleteFile(file, delay = 500) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			unlink(file, (err) => {
				if (err) resolve(`error: ${err}`);
				resolve('file deleted')
			})
		}, delay);
	})
}


export const addGroup = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, massage: 'Ошибка валидации', errors });
		const { lang, title } = req.body;
		const DB = { ...DB_skills };
		if (!DB[lang]) DB[lang] = [];

		let obj = {
			id: `group-${lang}-${setId()}`,
			title,
			skills: []
		}

		// result
		DB[lang].unshift(obj);
		writeFileSync(resolve(__dirname, '../DB/DB_skills.json'), JSON.stringify(DB))
		return res.status(200).json({ success: true, data: obj })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}

export const addSkill = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, massage: 'Ошибка валидации', errors });
		const { lang, name, ref } = req.body;
		const DB = { ...DB_skills };
		if (!DB[lang]) DB[lang] = [];
		const group = DB[lang].find(item => item.id === ref);
		if (!group) return res.status(400).json({ success: false, message: 'Элемент не найден' });
		const file = req?.files?.icon;

		let obj = {
			id: `skill-${lang}-${setId()}`,
			name, icon: resolve(__dirname, `../static/star.svg`),
		}

		// icon
		if (file) {
			let tempPath = resolve(__dirname, '../', `temp/${obj.id}.svg`);
			let svgPath = resolve(__dirname, '../', `uploads/${obj.id}.svg`);
			await file.mv(tempPath);
			const svgFill = await new SvgFill(iconColor);
			createReadStream(tempPath)
				.pipe(svgFill.fillSvgStream())
				.pipe(createWriteStream(svgPath));
			obj.icon = svgPath;
			await deleteFile(tempPath);
		}
		// result
		group?.skills.push(obj);
		writeFileSync(resolve(__dirname, '../DB/DB_skills.json'), JSON.stringify(DB))
		return res.status(200).json({ success: true, data: obj })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}


export const deleteGroup = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, massage: 'Ошибка валидации', errors });
		const { lang, id } = req.query;
		const DB = { ...DB_skills };
		if (!DB[lang]) DB[lang] = [];
		const group = DB[lang].find(item => item.id === id);
		if (!group) return res.status(400).json({ success: false, message: 'Элемент не найден' });

		group.skills.forEach(skill => {
			if (skill.icon !== resolve(__dirname, '../', 'static/star.svg')) {
				unlink(skill.icon, (err) => {
					if (err) throw err;
					console.log('deleted')
				})
			}
		})

		let filtered = DB[lang].filter(item => item.id !== id);
		DB[lang] = filtered;

		// result
		writeFileSync(resolve(__dirname, '../DB/DB_skills.json'), JSON.stringify(DB))
		return res.status(200).json({ success: true, data: 'Элемент удален' })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}

export const deleteSkill = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, massage: 'Ошибка валидации', errors });
		const { lang, id, ref } = req.query;
		const DB = { ...DB_skills };
		if (!DB[lang]) DB[lang] = [];
		const group = DB[lang].find(item => item.id === ref);
		if (!group) return res.status(400).json({ success: false, message: 'Элемент не найден' });
		const skill = group.skills.find(item => item.id === id);
		if (!skill) return res.status(400).json({ success: false, message: 'Элемент не найден' });

		let filtered = group.skills.filter(item => item.id !== id);
		group.skills = filtered;

		if (skill.icon !== resolve(__dirname, '../', 'static/star.svg')) {
			unlink(skill.icon, (err) => {
				if (err) throw err;
				console.log('deleted')
			})
		}

		// result
		writeFileSync(resolve(__dirname, '../DB/DB_skills.json'), JSON.stringify(DB))
		return res.status(200).json({ success: true, data: 'Элемент удален' })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}


export const editGroup = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, massage: 'ошибка валидации', errors: errors.array() });
		const { lang, id, title } = req.body;
		const DB = { ...DB_skills };
		if (!DB[lang]) DB[lang] = [];
		const group = DB[lang].find(item => item.id === id);
		if (!group) return res.status(400).json({ success: false, message: 'Элемент не найден' });

		group.title = title;

		// result
		writeFileSync(resolve(__dirname, '../DB/DB_skills.json'), JSON.stringify(DB))
		return res.status(200).json({ success: true, data: group })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}

export const editSkill = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, massage: 'ошибка валидации', errors: errors.array() });
		const { lang, id, ref, name } = req.body;
		const DB = { ...DB_skills };
		if (!DB[lang]) DB[lang] = [];
		const group = DB[lang].find(item => item.id === ref);
		if (!group) return res.status(400).json({ success: false, message: 'Элемент не найден' });
		const skill = group.skills.find(item => item.id === id);
		if (!skill) return res.status(400).json({ success: false, message: 'Элемент не найден' });
		const file = req?.files?.icon;

		if (name) skill.name = name;

		if (file && skill.icon !== resolve(__dirname, '../', 'static/star.svg')) {
			await deleteFile(skill.icon);
		}

		if (file) {
			let fileId = `skill-${lang}-${setId()}`;
			let tempPath = resolve(__dirname, '../', `temp/${fileId}.svg`);
			let svgPath = resolve(__dirname, '../', `uploads/${fileId}.svg`);
			await file.mv(tempPath);
			const svgFill = await new SvgFill(iconColor);
			createReadStream(tempPath)
				.pipe(svgFill.fillSvgStream())
				.pipe(createWriteStream(svgPath));
			skill.icon = svgPath;
			await deleteFile(tempPath);
		}


		// result
		writeFileSync(resolve(__dirname, '../DB/DB_skills.json'), JSON.stringify(DB))
		return res.status(200).json({ success: true, data: skill })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
}
