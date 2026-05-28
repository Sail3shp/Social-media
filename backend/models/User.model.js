import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"]
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: [true, "Email already exists"],
    },
    username: {
        type: String,
        required: [true, "Please enter username"],
        minlength: [6, "Username must be of minimum 6 characters"],
        unique: [true, "Username already exists"],
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        minlength: [6, "Password must be of minimum 6 characters"],
        select: false,
    },
    avatar: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: [50, "bio can't be more than 50 characters"],
        default: "Hi there "
    }
},
    { timestamps: true }
)

const User = mongoose.model('User',userSchema)

export default User