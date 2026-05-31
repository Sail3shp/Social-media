import jwt from 'jsonwebtoken'

const verifyUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: "fail",
                message: "No token provided"
            })
        }

        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(token, process.env.ACCESS_SECRET)

        req.userId = decoded.userId
        next()
    } catch (error) {
        console.log(error,'error in jwt')
        return res.status(401).json({
            status: "fail",
            message: "Invalid or expired token"
        })
    }

}

export default verifyUser