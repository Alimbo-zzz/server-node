import { body, query, param, header } from 'express-validator';
const langs = ['ru', 'en'];


// user
export const userEdit = [
	body('lang', `Некорректно передан язык (варианты: ${langs.toString()})`).isIn(langs),
	body('born', 'Передайте дату').optional().notEmpty(),
	body('username', 'Ключ должен содержать от 2 до 25 символов').optional().isLength({ min: 2, max: 25 }),
	body('live', 'Ключ должен содержать от 2 до 30 символов').optional().isLength({ min: 2, max: 30 }),
	body('mainText', 'Ключ должен содержать до 600 символов').optional().isLength({ max: 600 }),
	body('description', 'Ключ должен содержать до 600 символов').optional().isLength({ max: 600 }),
]

// reviews
export const reviewsAdd = [
	body('lang', `Некорректно передан язык (варианты: ${langs.toString()})`).isIn(langs),
	body('name', 'Ключ должен содержать от 2 до 25 символов').isLength({ min: 2, max: 25 }),
	body('job', 'Ключ должен содержать от 2 до 25 символов').isLength({ min: 2, max: 25 }),
	body('review', 'Ключ должен содержать до 600 символов').isLength({ max: 600 }),
]

export const reviewsEdit = [
	body('id', 'Передайте id').isString(),
	body('lang', `Некорректно передан язык (варианты: ${langs.toString()})`).isIn(langs),
	body('name', 'Ключ должен содержать от 2 до 25 символов').optional().isLength({ min: 2, max: 25 }),
	body('job', 'Ключ должен содержать от 2 до 25 символов').optional().isLength({ min: 2, max: 25 }),
	body('review', 'Ключ должен содержать до 600 символов').optional().isLength({ max: 600 }),
]

export const reviewsRemove = [
	query('id', 'Передайте id').isString(),
	query('lang', `Некорректно передан язык(варианты: ${langs.toString()})`).isIn(langs),
]

// portfolio


export const portfolioAdd = [
	body('lang', `Некорректно передан язык(варианты: ${langs.toString()})`).isIn(langs),
	body('links', 'Передайте JSON').isJSON(),
	body('tags', 'Передайте JSON').isJSON(),
	body('name', 'Передайте текст').isLength({ max: 40 }),
	body('description', 'Ключ должен содержать до 600 символов').isLength({ max: 600 }),
]

export const portfolioEdit = [
	body('id', 'Передайте id').isString(),
	body('lang', `Некорректно передан язык(варианты: ${langs.toString()})`).isIn(langs),
	body('links', 'Передайте JSON').optional().isJSON(),
	body('tags', 'Передайте JSON').optional().isJSON(),
	body('name', 'Передайте текст').optional().isLength({ max: 40 }),
	body('description', 'Ключ должен содержать до 600 символов').optional().isLength({ max: 600 }),
]

export const portfolioRemove = [
	query('id', 'Передайте id').isString(),
	query('lang', `Некорректно передан язык(варианты: ${langs.toString()})`).isIn(langs)
]

// skills

export const skillsGroupAdd = [
	body('lang', `Некорректно передан язык(варианты: ${langs.toString()})`).isIn(langs),
	body('title', 'Ключ должен содержать от 2 до 35 символов').isLength({ min: 2, max: 35 }),
]

export const skillAdd = [
	body('lang', `Некорректно передан язык(варианты: ${langs.toString()})`).isIn(langs),
	body('ref', 'Передайте ref id').isString(),
	body('name', 'Ключ должен содержать от 2 до 24 символов').isLength({ min: 2, max: 24 }),
]
export const skillDelete = [
	query('lang', `Некорректно передан язык(варианты: ${langs.toString()})`).isIn(langs),
	query('ref', 'Передайте ref id').isString(),
	query('id', 'Передайте id').isString(),
]
export const groupDelete = [
	query('lang', `Некорректно передан язык(варианты: ${langs.toString()})`).isIn(langs),
	query('id', 'Передайте id').isString(),
]
export const groupEdit = [
	body('lang', `Некорректно передан язык(варианты: ${langs.toString()})`).isIn(langs),
	body('id', 'Передайте id').isString(),
	body('title', 'Ключ должен содержать от 2 до 35 символов').isLength({ min: 2, max: 35 }),
]
export const skillEdit = [
	body('lang', `Некорректно передан язык(варианты: ${langs.toString()})`).isIn(langs),
	body('id', 'Передайте id').isString(),
	body('ref', 'Передайте ref id').isString(),
	body('name', 'Ключ должен содержать от 2 до 24 символов').optional().isLength({ min: 2, max: 24 }),
]
export const deleteIcon = [
	query('path', 'Передайте путь к файлу').isString(),
	query('delay', 'Передайте чило в миллисекундах').optional().isNumeric()
]
