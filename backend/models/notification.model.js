import mongoose, { Schema } from 'mongoose'

const notificationSchema = new mongoose.Schema({
    from :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        required: true,
        enum: ['like','follow']
    },
    read: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true
})

const Notification = mongoose.model('notification',notificationSchema)

export default Notification