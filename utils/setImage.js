import { v4 as setId } from 'uuid';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export default (file) => {
	try {
		const result = { error: null, path: null };
		let mb = Math.pow(1024, 2);
		let maxSize = 15 * mb; // 15mb
		let ext = file?.name ? file.name.split('.').pop() : 'jpg';
		let fileName = `image-${setId()}.${ext}`;
		let dir = resolve(__dirname, '../uploads');
		// errors  
		if (!file) return ({ ...result, error: "Файл не найден" });
		if (file.mimetype.split('/')[0] !== 'image') return res.status(400).json({ success: false, message: 'Передайте изображение' });
		if (file.size > maxSize) return res.status(400).json({ success: false, message: `Размер файла не должен превышать ${maxSize / mb}мб` });
		// set file
		let path = resolve(dir, fileName);
		file.mv(path);
		return ({ ...result, path });
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Непредвиденная ошибка' })
	}
};