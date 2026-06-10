import express from 'express'
import { createPost, deletePost, getFollowingPoints, getPost, getPostById, likeAndUnlikePost } from '../controllers/post.controller.js'
import verifyUser from '../middlewares/verifyUser.js'

const router = express.Router()

router.get('/',getPost)
router.get('/:id',getPostById)

router.post('/',verifyUser,createPost)
router.delete('/:postId',verifyUser,deletePost)
router.patch('/:postId',verifyUser,likeAndUnlikePost)
router.get('/following',verifyUser,getFollowingPoints)

export default router