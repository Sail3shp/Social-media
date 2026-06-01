export const errorHandler = (err, req, res, next) => {
    console.log(err.stack, err.message,err)
    const statusCode = err.statusCode || 500
    const status = err.status || 'error'
    const message = err.message || 'Internal server error'
    res.status(statusCode).json({
        status: status,
        message: message
    })
}