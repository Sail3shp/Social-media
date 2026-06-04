import express from 'express'
import { createPost, deletePost, getPost, getPostById, likeAndUnlikePost } from '../controllers/post.controller.js'
import verifyUser from '../middlewares/verifyUser.js'

const router = express.Router()

router.get('/',getPost)
router.get('/:id',getPostById)

router.post('/',verifyUser,createPost)
router.delete('/:postId',verifyUser,deletePost)
router.patch('/:postId',verifyUser,likeAndUnlikePost)

export default router