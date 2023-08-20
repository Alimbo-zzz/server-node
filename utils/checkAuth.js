import * as dotenv from 'dotenv';
const env = dotenv.config().parsed;

export default (req, res, next) => {
	try {
		const { authorization } = req.headers;
		let error_auth = { success: false, message: "Передайте <header> authorization: {user: <login>, pass: <password> }" };
		if (!authorization) return res.status(401).json(error_auth);
		let auth = JSON.parse(JSON.stringify(authorization));
		const { user, pass } = JSON.parse(auth);
		if (!user || !pass) return res.status(401).json(error_auth);
		const { AUTH_USER, AUTH_PASS } = env;
		if (AUTH_PASS !== pass || AUTH_USER !== user) return res.status(401).json({ success: false, message: "неверный логин или пароль" })

		next();
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, message: `непредвиденная ошибка`, error });
	}


};