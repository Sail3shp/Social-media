import express from 'express'
import verifyUser from '../middlewares/verifyUser.js'
import { getMessages, getSidebarUsers, sendMessage } from '../controllers/message.controller.js'

const router = express.Router()

router.post('/message/:receiverId',verifyUser,sendMessage)
router.get('/message/:id',verifyUser,getMessages)
router.get('/sidebarusers',verifyUser,getSidebarUsers)

export default router