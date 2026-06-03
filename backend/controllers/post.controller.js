import Post from "../models/post.model.js";
import { catchAsync } from "../middlewares/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";

export const getPost = catchAsync(async(req,res) => {
    const posts = await Post.find()

    res.status(200).json({
        status: 'success',
        data: posts
    })
})


export const getPostById = catchAsync(async(req,res) => {
    const {id} = req.params

    if(!id) {
        throw new ApiError('Please provide a valid id',400)
    }

    const post = await Post.findById(id)

    res.status(200).json({
        status: 'success',
        data: post
    })
})

export const createPost = catchAsync(
    async(req,res) => {
        const {caption,image} = req.body

        if(!caption && !image) {
            throw new ApiError('Please provide atleast a caption or an image',400)
        }

        if(image){
            const cloudy = cloudinary.uploader.upload('../avatar-4.png')
            console.log(cloudy)
        }
        const post = await Post.create({
            user: req.userId,
            caption,
            image: cloudy?.secure_url
        })

       res.status(201).json({
        status: 'success',
        message:'Post created',
        data: post
    })
    }
)