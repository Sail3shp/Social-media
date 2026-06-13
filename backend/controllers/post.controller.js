import Post from "../models/post.model.js";
import { catchAsync } from "../middlewares/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";
import User from '../models/User.model.js'

export const getPost = catchAsync(async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).populate({
        path: 'user'
    }).populate({
        path: "comments.user",
        select: "-password",
    })

    res.status(200).json({
        status: 'success',
        data: posts
    })
})


export const getPostById = catchAsync(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError('Please provide a valid id', 400)
    }

    const post = await Post.findById(id)

    res.status(200).json({
        status: 'success',
        data: post
    })
})

export const createPost = catchAsync(
    async (req, res) => {
        let { caption, image } = req.body

        if (!caption && !image) {
            throw new ApiError('Please provide atleast a caption or an image', 400)
        }

        if (image) {
            const cloudy = await cloudinary.uploader.upload(image)
            image = cloudy?.secure_url
            console.log(cloudy)
        }
        const post = await Post.create({
            user: req.userId,
            caption,
            image
        })

        res.status(201).json({
            status: 'success',
            message: 'Post created',
            data: post
        })
    }
)

export const deletePost = catchAsync(
    async (req, res) => {
        const { postId } = req.params

        const post = await Post.findById(postId)
        if (!post) {
            throw new ApiError("post not found", 404)
        }

        if (post.user.toString() !== req.userId) {
            throw new ApiError('Forbidden', 403)
        }

        if (post.image) {
            cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0])
        }

        const deletedPost = await Post.findByIdAndDelete(postId)

        if (!deletedPost) {
            throw new ApiError("Post can't be deleted", 400)
        }
        res.status(204).send()
    }
)

export const likeAndUnlikePost = catchAsync(
    async (req, res) => {
        const { postId } = req.params
        const post = await Post.findById(postId)

        if (!post) {
            throw new ApiError('Post not found', 404)
        }
        console.log(post.likes.includes(req.userId))

        if (!post.likes.includes(req.userId)) {
            const likedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    $addToSet: {
                        likes: req.userId
                    }
                }
            )
            console.log(likedPost)
            return res.status(200).json({
                status: 'success',
                message: 'Post liked'
            })
        }


        const unLikePost = await Post.findByIdAndUpdate(
            postId,
            {
                $pull: {
                    likes: req.userId
                }
            }
        )

        res.status(200).json({
            status: 'success',
            message: 'Post unliked'
        })
    }

)

export const updatePost = catchAsync(
    async (req, res) => {
        const { postId } = req.params
        const { image, caption } = req.body

        const updateData = {}

        if (image !== undefined) updateData.image = image
        if (caption !== undefined) updateData.caption = caption

        const post = await Post.findById(postId)
        if (!post) {
            throw new ApiError('Post not found', 404)
        }
        if (post.user.toString() !== req.userId) {
            throw new ApiError('This post doesn\'t belong to you ', 403)
        }
        if (image) {
            const cloudy = await cloudinary.uploader.upload('../avatar-4.png')
            updateData.image = cloudy?.secure_url
            if (post.image) {
                await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0])
            }
        }

        if (Object.keys(updateData).length === 0) {
            throw new ApiError('No fields provided for update', 400)
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true })


        res.status(200).json({
            status: 'success',
            message: 'Post updated',
            data: updatedPost
        })
    }
)

export const getFollowingPoints = catchAsync(
    async (req, res) => {
        const activeUser = await User.findById(req.userId)
        if (!activeUser) return res.status(404).json({ error: "User not found" });

        const following = activeUser.following;

        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json({
            status: 'success',
            data: feedPosts
        });
    }
)

export const commentOnPost = catchAsync(
    async (req, res) => {

        const { postId } = req.params
        const { text } = req.body
        const userId = req.userId

        const post = await Post.findById(postId)

        if (!post) {
            throw new ApiError('post not found', 404)
        }

        const commentedPost = await Post.findByIdAndUpdate(postId, {
            $push: {
                comments: {
                    text: text,
                    user: userId,
                },
            },
        }, { new: true }
        )

        if (!commentedPost) {
            throw new ApiError('couldn\'t comment on this post', 400)
        }

        res.status(201).json({
            status: 'success',
            commentedPost
        })

    }
)

export const getLikedPosts = catchAsync(
    async(req,res) => {
        const {userId} = req.params

        const posts = await Post.find({
            likes:{
                $in: [userId]
            }
        }).populate('user')

        if(!posts){
            throw new ApiError('No liked posts',400)
        }

        res.status(200).json({
            status: 'success',
            data: posts
        })
    }
)

export const getAllPostOfUser = catchAsync(
    async(req,res) => {

        const {username} = req.params

        const posts = await Post.find({
            user:{
                $in: [username]
            }
        }).populate('user')

        if(!posts){
            throw new ApiError('post not found',404)
        }

        res.status(200).json({
            status: 'success',
            data: posts 
        })
    }
) 
