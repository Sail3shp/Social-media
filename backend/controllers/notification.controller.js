import { catchAsync } from "../middlewares/catchAsync.js";
import Notification from "../models/notification.model.js";
import ApiError from "../utils/ApiError.js";

export const getNotifications = catchAsync(
    async (req, res) => {
        const userId = req.userId

        const notifications = await Notification.find({
            to: userId
        }).populate({
            path: 'from',
            select: 'username avatar'
        })


        if (!notifications) {
            throw new ApiError('No notifications found', 404)
        }


        await Notification.updateMany({
            to: userId
        }, { read: true })

        res.status(200).json({
            status: 'success',
            data: notifications
        })

    }
)

export const deleteNotifications = catchAsync(
    async(req,res) => {
        const userId = req.userId

        await Notification.deleteMany({
            to: userId,
        })

        res.status(204).json({
            status:'success',
            message: 'Notifications cleared'
        })
    }
)