import { createRequire } from "module";
const require = createRequire(import.meta.url);
const DB_user = require('../DB/DB_user.json');



export default (data) => {
	const { avatar = null, born = null } = data;
	const result = { ...DB_user };
	if (!data?.lang) { console.log('lang не передан'); return false };
	// born
	let born_unix = Date.parse(new Date(Number(born)));
	if (born_unix) result.born = born_unix;
	// avatar
	if (typeof avatar === 'string') result.avatar = avatar;
	// keys
	let obj_lang = result[data.lang];
	if (!obj_lang) result[data.lang] = {};
	const keys = ['username', 'live', 'mainText', 'description'];

	keys.forEach(key => {
		if (!result[data.lang][key]) result[data.lang][key] = '';
	})


	for (const key in data) {
		if (keys.find(el => el === key)) result[data.lang][key] = data[key];
	}


	return result;
};
