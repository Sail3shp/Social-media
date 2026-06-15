import { catchAsync } from "../middlewares/catchAsync.js";
import User from "../models/User.model.js";
import Session from "../models/session.model.js";
import ApiError from "../utils/ApiError.js";
import { refreshToken } from "./auth.controller.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
//updat,delete,changepassword,resetpassword

export const deleteUser = async (req, res) => {
    try {
        await Session.updateMany({
            user: req.userId,
            revoked: false,
        }, {
            revoked: true
        })

        const deletedUser = await User.findByIdAndDelete(req.userId)

        if (!deletedUser) {
            return res.status(404).json({
                status: 'fail',
                message: 'No user found'
            })
        }
        res.clearCookie('refreshToken')

        res.status(204).send()

    } catch (error) {
        console.log('error in deleting account', error)
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        })
    }

}

export const suggestedUsers = catchAsync(
    async (req, res) => {
        const userId = req.userId;

        const usersFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: new mongoose.Types.ObjectId(userId) },
                },
            },
            { $sample: { size: 10 } },
        ]);

        // 1,2,3,4,5,6,
        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4);

        suggestedUsers.forEach((user) => (user.password = null));

        res.status(200).json({
            status: 'success',
            data: suggestedUsers
        });
    }
)

export const getUserDetails = catchAsync(
    async (req, res) => {
        const { username } = req.params
        console.log(username)
        const user = await User.findOne({
            username: req.params.username
        })
        console.log(user)
        if (!user) throw new ApiError('user not found', 404)


        return res.status(200).json({
            status: 'success',
            data: user
        })
    }
)

export const followUnfollow = catchAsync(
    async (req, res) => {
        const user = await User.findById(req.userId)

        const followUnfollowUser = await User.findById(req.params.id)

        if (!user || !followUnfollowUser) {
            throw new ApiError('User not found', 404)
        }

        if (req.userId === req.params.id) {
            throw new ApiError("You cannot follow yourself", 400);
        }

        const isFollowing = followUnfollowUser.followers.find((follower) => follower.toString() === req.userId)
        console.log(isFollowing)

        if (!isFollowing) {

            await Promise.all([
                User.findByIdAndUpdate(req.params.id, {
                    $addToSet: { followers: req.userId }
                }),
                User.findByIdAndUpdate(req.userId, {
                    $addToSet: { following: req.params.id }
                })
            ]);

            return res.status(201).json({
                status: 'success',
                message: 'User followed successfully'
            })
        }

        await Promise.all([
            User.findByIdAndUpdate(req.params.id, {
                $pull: { followers: req.userId }
            }),
            User.findByIdAndUpdate(req.userId, {
                $pull: { following: req.params.id }
            })
        ]);
        res.status(201).json({
            status: 'success',
            message: 'User unfollowed successfully'
        })


    }
)

export const updateUser = catchAsync(
    async (req, res) => {
        const userId = req.userId

        const { name, email, username, currentPassword, newPassword, bio } = req.body;
        let { avatar, coverImg } = req.body

        let user = await User.findById(userId)

        if (!user) {
            throw new ApiError('User not found', 404)
        }
        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" });
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                throw new ApiError('Current password is incorrect', 400)
            }
            if (newPassword.length < 6) {
                throw new ApiError('Password must be 6 characters long', 400)
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (avatar) {
            if (user.avatar) {
                await cloudinary.uploader.destroy(user.avatar.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(avatar);
            avatar = uploadedResponse.secure_url;
        }

        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.avatar = avatar || user.avatar;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        // password should be null in response
        user.password = null;

        res.status(200).json({
            status: 'success',
            data: user
        })


    }
)