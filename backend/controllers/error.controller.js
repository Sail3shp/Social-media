const devErrors = (res,err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stackTrace: err.stack,
        error: err 
    })
}

const prodErrors = (res,err) => {
    if(err.isOperational){
res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }else{
        res.status(err.statusCode).json({
            status:'error',
            message:'Something went wrong.Please try again later!'
        })
    }
    
}
export const errorHandler = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    err.message = err.message || 'Internal server error'

    if (process.env.NODE_ENV === 'development') {
        devErrors(res,err)
    }else{
        prodErrors(res,err)
    }

}