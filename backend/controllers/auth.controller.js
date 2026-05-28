import User from "../models/User.model.js";
import bcrypt from 'bcryptjs'


export const register = async(req,res) => {
    try {
        const {name,email,username,password} = req.body

        if(!name || !email || !username || !password){
            return res.status(400).json({
                status:'fail',
                message: 'Please provide all fields'
            })
        }

        const exitingUser = await User.findOne({
            $or:[{email},{username}]
        })
        console.log(exitingUser,!!exitingUser)
        if(exitingUser){
            return res.status(400).json({
                status:"fail",
                message:"User already exists"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password,salt)
        console.log(hash)

        const newUser = await User.create({
            name,
            email,
            username,
            password:hash
        })
        newUser.password = undefined

        res.status(201).json({
            status:"success",
            message:"User created successfully",
            user:newUser
        })
        
    } catch (error) {
        console.log('error in register',error)
        res.status(500).json({
            status:'error',
            message:'Internal server error'
        })
    }
}

export const login = async(req,res) => {
    try {
        
    } catch (error) {
       console.log('error in register',error)
        res.status(500).json({
            status:'error',
            message:'Internal server error'
        }) 
    }
}