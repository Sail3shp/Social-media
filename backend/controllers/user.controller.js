import { catchAsync } from "../middlewares/catchAsync.js";
import User from "../models/User.model.js";
import Session from "../models/session.model.js";
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
    async(req,res) => {
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
            status:'success',
            data: suggestedUsers
        });
    }
)
