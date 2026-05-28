import User from "../models/User.model.js";
import bcrypt from 'bcryptjs'
import { generateTokens } from "../utils/tokens.js";


export const register = async (req, res) => {
    try {
        const { name, email, username, password } = req.body

        if (!name || !email || !username || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide all fields'
            })
        }

        const exitingUser = await User.findOne({
            $or: [{ email }, { username }]
        })
        console.log(exitingUser, !!exitingUser)
        if (existingUser) {

            const errors = []

            if (existingUser.email === email) {
                errors.push("Email already exists")
            }

            if (existingUser.username === username) {
                errors.push("Username already taken")
            }

            return res.status(400).json({
                status: "fail",
                message: errors
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        console.log(hash)

        const newUser = await User.create({
            name,
            email,
            username,
            password: hash
        })
        newUser.password = undefined

        res.status(201).json({
            status: "success",
            message: "User created successfully",
            user: newUser
        })

    } catch (error) {
        console.log('error in register', error)
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({email}).select('+password')
        if(!user){
           return res.status(400).json({
                status:"fail",
                message:"Invalid email or password"
            }) 
        }
        const isValidPassword = await bcrypt.compare(password,user.password)
        if(!isValidPassword){
            return res.status(400).json({
                status:"fail",
                message:"Invalid email or password"
            })
        }
        const accessToken = generateTokens(user._id,res)
        res.status(200).json({
            message:"User logged in successfully",
            token:accessToken
        })
    } catch (error) {
        console.log('error in logout', error)
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        })
    }
}

export const getMe = async(req,res) => {
    try {
       const user = await User.findById(req.userId) 
       if(!user){
        res.status(400).json({
            status:'fail',
            message:'user not found'
        })
       }

       res.status(200).json({
        status:"success",
        message:"user fetched successfull",
        user
       })
    } catch (error) {
        console.log('error in logout', error)
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        }) 
    }
}