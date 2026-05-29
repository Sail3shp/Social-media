import jwt from 'jsonwebtoken'
export const generateTokens = (userId,res) => {
    const accessToken = jwt.sign({userId},process.env.ACCESS_SECRET,{expiresIn: '15m'})

    const refreshToken = jwt.sign({userId},process.env.REFRESH_SECRET,{expiresIn: '7d'})

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return {
        accessToken,
        refreshToken
    }
    

}