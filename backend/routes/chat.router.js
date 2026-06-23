import express from 'express'
import verifyUser from '../middlewares/verifyUser.js'
import { getMessages, sendMessage } from '../controllers/message.controller.js'

const router = express.Router()

router.post('/message/:receiverId',verifyUser,sendMessage)
router.get('/message/:id',verifyUser,getMessages)

export default router