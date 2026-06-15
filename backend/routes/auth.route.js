import express from 'express'
import { getMe, login, register,refreshToken, logout, logoutAll } from '../controllers/auth.controller.js'
import verifyUser from '../middlewares/verifyUser.js'
import { deleteUser, followUnfollow, getUserDetails, suggestedUsers,updateUser } from '../controllers/user.controller.js'

const router = express.Router()

//auth routes
router.post('/signup',register)
router.post('/login',login)
router.get('/me',verifyUser,getMe)
router.post('/refresh',verifyUser,refreshToken)
router.post('/logout',verifyUser,logout)
router.post('/logout-all',verifyUser,logoutAll)

//user routes 
router.delete('/delete',verifyUser,deleteUser)
router.get('/suggested',verifyUser,suggestedUsers)
router.get('/:username',getUserDetails)
router.post('/follow/:id',verifyUser,followUnfollow)
router.post('/update',verifyUser,updateUser)

export default router