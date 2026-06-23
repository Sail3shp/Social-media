import Message from "../models/chat.model.js";
import Conversation from "../models/conversation.model.js";
import User from "../models/User.model.js";
import { catchAsync } from "../middlewares/catchAsync.js";
import ApiError from "../utils/ApiError.js";

export const sendMessage = catchAsync(
    async (req, res) => {
        const { receiverId } = req.params
        const userId = req.userId
        const { text } = req.body
        const receiver = await User.findById(receiverId)

        if (!receiver) {
            throw new ApiError('User not found', 404)
        }

        let conversation = await Conversation.findOne({
            members: {
                $all: [userId, receiverId]
            }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                members: [userId, receiverId]
            })
        }

        const newMessage = new Message({
            sender: userId,
            receiver: receiverId,
            message: text
        })

        
        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }

        await Promise.all([conversation.save(), newMessage.save()])

        res.status(201).json({
            status: 'success',
            data: newMessage
        })

    }
)

export const getMessages = catchAsync(
    async (req, res) => {

        const { id: receiver } = req.params
        const sender = req.userId

        let conversation = await Conversation.findOne({
            members: {
                $all: [sender, receiver]
            }
        }).populate({
            path: 'messages',
            populate: [
                {
                    path: 'sender',
                    select: 'username email avatar'
                },
                {
                    path: 'receiver',
                    select: 'username email avatar'
                }
            ]
        })

        if (!conversation) {
            return res.status(200).json([])
        }

        res.status(200).json({
            status: 'success',
            data: conversation.messages
        })


    }
)