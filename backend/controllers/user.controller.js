import { catchAsync } from "../middlewares/catchAsync.js";
import User from "../models/User.model.js";
import Session from "../models/session.model.js";
import ApiError from "../utils/ApiError.js";
import { refreshToken } from "./auth.controller.js";
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
                    _id: { $ne: userId },
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

        const isFollowing = followUnfollowUser.followers.find((follower) => follower == req.userId)
        console.log(isFollowing)

        if (!isFollowing) {

            const newUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $addToSet: {
                        followers: req.userId
                    }
                }
            )

            const followedUser = await User.findByIdAndUpdate(
                req.userId,
                {
                    $addToSet: {
                        following: req.params.id
                    }
                }
            )

            return res.status(201).json({
                status: 'success',
                message: 'User followed successfully'
            })
        }

        const oldUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    followers: req.userId
                }
            }
        )

        const unfollowedUser = await User.findByIdAndUpdate(
            req.userId,
            {
                $pull: {
                    following: req.params.id
                }
            }
        )
        res.status(201).json({
            status: 'success',
            message: 'User unfollowed successfully'
        })


    }
)