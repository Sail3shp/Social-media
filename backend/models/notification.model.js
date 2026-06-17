import mongoose, { Schema } from 'mongoose'

const notificationSchema = new mongoose.Schema({
    from :{
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    type: {
        type: String,
        requeired: true,
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