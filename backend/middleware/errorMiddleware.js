
// 404 error creator:
// no specified route meaning all server requests will pass through this code if any route before this was not resolved
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error) // pass the error down to the next middleware if needed
}

// error handling middleware:
const errorHandler = (err, req, res, next) => {

    // this code will be fired off only when error object exists in the app.
    // err: catches errors thrown from anyware in our server or errors from the DB
    // sometimes even errors could have a statuscode of 200 so we need to change them to the 500 server error relm
    // if it's not 200 it will have it's original status code

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode)
    res.json({
        message: err.message,

        // the stack of the error object is it's explanation (we will show it only in dev)
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

export { notFound, errorHandler }

