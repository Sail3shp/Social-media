import express from 'express'
import { getMe, login, register } from '../controllers/auth.controller.js'
import verifyUser from '../middlewares/verifyUser.js'

const router = express.Router()

router.post('/signup',register)
router.post('/login',login)
router.get('/me',verifyUser,getMe)

export default router