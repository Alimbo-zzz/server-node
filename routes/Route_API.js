import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import * as VAL from '../validations/VAL_admin.js'
import * as CTRL_user from '../controllers/CTRL_user.js';
import * as CTRL_reviews from '../controllers/CTRL_reviews.js';
import * as CTRL_portfolio from '../controllers/CTRL_portfolio.js';
import * as CTRL_skills from '../controllers/CTRL_skills.js';
import * as CTRL_sendMail from '../controllers/CTRL_sendMail.js';

import * as dotenv from 'dotenv';
const env = dotenv.config().parsed;

const router = express.Router();


router.get('/', (req, res) => {
	res.send('hello world');
})

// user
router.get(`/v1/api/user/data`, checkAuth, CTRL_user.data)
router.put(`/v1/api/user/edit`, checkAuth, VAL.userEdit, CTRL_user.edit)
router.delete(`/v1/api/user/delete/avatar`, checkAuth, CTRL_user.removeAvatar)
// reviews
router.get(`/v1/api/reviews/data`, checkAuth, CTRL_reviews.data)
router.post(`/v1/api/reviews/add/item`, checkAuth, VAL.reviewsAdd, CTRL_reviews.add)
router.put(`/v1/api/reviews/edit/item`, checkAuth, VAL.reviewsEdit, CTRL_reviews.edit)
router.delete(`/v1/api/reviews/delete/item`, checkAuth, VAL.reviewsRemove, CTRL_reviews.remove)
router.delete(`/v1/api/reviews/delete/avatar`, checkAuth, VAL.reviewsRemove, CTRL_reviews.removeAvatar)
// portfolio
router.get(`/v1/api/portfolio/data`, checkAuth, CTRL_portfolio.data)
router.post(`/v1/api/portfolio/add/item`, checkAuth, VAL.portfolioAdd, CTRL_portfolio.add)
router.put(`/v1/api/portfolio/edit/item`, checkAuth, VAL.portfolioEdit, CTRL_portfolio.edit)
router.delete(`/v1/api/portfolio/delete/item`, checkAuth, VAL.portfolioRemove, CTRL_portfolio.remove)
// skills
router.get(`/v1/api/skills/data`, checkAuth, CTRL_skills.data)
router.post(`/v1/api/skills/add/group`, checkAuth, VAL.skillsGroupAdd, CTRL_skills.addGroup)
router.post(`/v1/api/skills/add/skill`, checkAuth, VAL.skillAdd, CTRL_skills.addSkill)
router.delete(`/v1/api/skills/delete/group`, checkAuth, VAL.groupDelete, CTRL_skills.deleteGroup)
router.delete(`/v1/api/skills/delete/skill`, checkAuth, VAL.skillDelete, CTRL_skills.deleteSkill)
router.put(`/v1/api/skills/edit/group`, checkAuth, VAL.groupEdit, CTRL_skills.editGroup)
router.put(`/v1/api/skills/edit/skill`, checkAuth, VAL.skillEdit, CTRL_skills.editSkill)
// 
router.get(`/v1/api/mail/send`, CTRL_sendMail.send)
router.get(`/test`, (req, res) => {
	try {
		return res.status(200).json({ message: 'success' })
	} catch (error) {
		return res.status(400).json({ message: 'error' })
	}
})


export default router;