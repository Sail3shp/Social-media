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
