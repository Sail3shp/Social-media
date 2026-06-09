import User from "../models/User.model.js";
import Session from "../models/session.model.js";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { generateTokens } from "../utils/tokens.js";
import ApiError from "../utils/ApiError.js";
import { catchAsync } from "../middlewares/catchAsync.js";


export const register = catchAsync(async (req, res) => {
    const { name, email, username, password } = req.body

    if (!name || !email || !username || !password) {
        throw new ApiError('Please provide all fields',400) 
    }
    console.log(name,email,username,password)

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    console.log(existingUser, !!existingUser)
    const errors = []
    if (existingUser) {
        
        if (existingUser.email === email) {
            errors.push("Email already exists")
        }

        if (existingUser.username === username) {
            errors.push("Username already taken")
        }

        throw new ApiError(errors,400)
    }

    if(username.length < 6 && password.length < 6){
        throw new ApiError('Username & password must be greater than 6 characters',400)
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
    const { accessToken, refreshToken } = generateTokens(newUser._id, res)

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')

    await Session.create({
        user: newUser._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]

    })
    res.status(201).json({
        status: "success",
        message: "User created successfully",
        token: accessToken,
        user: newUser
    })

}
)

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        throw new ApiError('Invalid email or password', 400)
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
        throw new ApiError('Invalid email or password', 400)
    }

    const { accessToken, refreshToken } = generateTokens(user._id, res)
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    await Session.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]

    })
    user.password = undefined
    res.status(200).json({
        message: "User logged in successfully",
        user,
        token: accessToken
    })
})

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            throw new ApiError('Invalid email or password',400) 
        }

        res.status(200).json({
            status: "success",
            message: "user fetched successfull",
            user
        })
    } catch (error) {
        next(error)
    }
}

export const logout = catchAsync(async (req, res) => {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            throw new ApiError('No token found',400)
        }

        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
        const session = await Session.findOne({ refreshTokenHash, revoked: false })

        if (!session) {
            throw new ApiError('Invalid session',400) 
        }

        res.clearCookie('refreshToken')
        session.revoked = true
        await session.save()
        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        })
})

export const logoutAll = catchAsync(async (req, res) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            throw new ApiError('Refresh token not found',400)
        }
        await Session.updateMany({
            user: req.userId,
            revoked: false
        }, {
            revoked: true
        })

        res.clearCookie('refreshToken')

        res.status(200).json({
            status: 'success',
            message: 'Logged out from all devices'
        })

    } 
)

export const refreshToken = catchAsync(async (req, res) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            throw new ApiError('Unauthorized',401) 
        }
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')

        const session = await Session.findOne({
            refreshTokenHash,
            revoked: false
        }).populate('user')
        if (!session) {
            res.clearCookie('refreshToken')

            throw new ApiError('Invalid session',401)
        }
        session.revoked = true
        await session.save()
        const { accessToken } = generateTokens(session.user._id, res)
        res.status(200).json({
            status: 'success',
            message: 'token refreshed successfully',
            token: accessToken
        })
})