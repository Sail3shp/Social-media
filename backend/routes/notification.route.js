import express from 'express'
import verifyUser from '../middlewares/verifyUser'
import { deleteNotifications, getNotifications } from '../controllers/notification.controller'

const router = express.Router()

router.get('/',verifyUser,getNotifications)
router.delete('/',verifyUser,deleteNotifications)

export default router