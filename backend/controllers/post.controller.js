import Post from "../models/post.model.js";
import { catchAsync } from "../middlewares/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";

export const getPost = catchAsync(async (req, res) => {
    const posts = await Post.find().sort({createdAt: -1}).populate({
        path: 'user'
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
        const { caption, image } = req.body

        if (!caption && !image) {
            throw new ApiError('Please provide atleast a caption or an image', 400)
        }

        if (image) {
            const cloudy = cloudinary.uploader.upload()
            console.log(cloudy)
        }
        const post = await Post.create({
            user: req.userId,
            caption,
            image: cloudy?.secure_url
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
        if(!post){
            throw new ApiError('Post not found',404)
        }
        if(post.user.toString() !== req.userId){
            throw new ApiError('This post doesn\'t belong to you ' ,403)
        }
        if (image) {
            const cloudy = await cloudinary.uploader.upload('../avatar-4.png')
            updateData.image = cloudy?.secure_url
            if(post.image){
                await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0])
            }
        }

        if (Object.keys(updateData).length === 0) {
            throw new ApiError('No fields provided for update', 400)
        }

        const updatedPost = await Post.findByIdAndUpdate(postId,updateData,{new: true})


        res.status(200).json({
            status: 'success',
            message: 'Post updated',
            data: updatedPost
        })
    }
)