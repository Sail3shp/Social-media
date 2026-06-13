import express from 'express'
import { commentOnPost, createPost, deletePost, getAllPostOfUser, getFollowingPoints, getLikedPosts, getPost, getPostById, likeAndUnlikePost } from '../controllers/post.controller.js'
import verifyUser from '../middlewares/verifyUser.js'

const router = express.Router()

router.get('/',getPost)
router.get('/following',verifyUser,getFollowingPoints)
router.get('/:id',getPostById)

router.post('/',verifyUser,createPost)
router.delete('/:postId',verifyUser,deletePost)
router.patch('/:postId',verifyUser,likeAndUnlikePost)
router.post('/comment/:postId',verifyUser,commentOnPost)
router.get('/likes/:userId',getLikedPosts)
router.get('/users/:username',getAllPostOfUser)

export default router