import express from 'express'
import { createPost, getPost, getPostById } from '../controllers/post.controller.js'
import verifyUser from '../middlewares/verifyUser.js'

const router = express.Router()

router.get('/',getPost)
router.get('/:id',getPostById)

router.post('/',verifyUser,createPost)

export default router