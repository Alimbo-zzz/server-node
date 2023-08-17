import { createRequire } from "module";
const require = createRequire(import.meta.url);
const DB_reviews = require('../DB/DB_reviews.json');
import { v4 as setId } from 'uuid';


export default (data, action = 'add') => {
	const result = { ...DB_reviews };
	const keys = ['name', 'job', 'avatar', 'review'];

	function add() {
		let obj = { id: `review-${data.lang}-${setId()}` };

		keys.forEach(key => {
			if (typeof data[key] === 'string') obj[key] = data[key];
			else obj[key] = '';
		})

		if (!result[data.lang]) result[data.lang] = [];
		result[data.lang].unshift(obj);
	}

	function edit() {
		if (!result[data.lang]) { console.log('DTO error: язык не найден'); return false; }

		result[data.lang].map(item => {
			let obj = item;

			if (item.id === data.id) {
				keys.forEach(key => {
					if (typeof data[key] === 'string') obj[key] = data[key];
				})
			}

			return obj;
		});
	}
	function remove() {
		if (!result[data.lang]) { console.log('DTO error: язык не найден'); return false; }
		const filtered = result[data.lang].filter(item => item.id !== data.id);
		result[data.lang] = filtered;
	}



	try {
		// add
		if (action === 'add') add();
		// edit
		else if (action === 'edit') edit();
		// remove
		else if (action === 'remove') remove();

		else {
			console.log('action не найден')
			result = false;
		}

	} catch (error) {
		console.log('ошибка DTO')
		result = false;
	}

	return result;
};



