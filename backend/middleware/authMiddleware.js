// handle async error 
// Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
    let token // assign a token variable first, it will be undefined at begining

    // console.log(req.headers.authorization)  // Bearer <token>

    // check the token start with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        // Why "try-catch" block is used here while we are using asyncHandler?
        // to catch specific errors and send custom error we can use try-catch along with asyncHandler. asyncHandler is for common error scenarios.
        try {
            token = req.headers.authorization.split(' ')[1] // split with space, and ignore the Bearer, just get the token

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // console.log(decoded) // get the user object like {id: xxx , iat: xxx, exp:xxx}

            // mongoose method Model.find().select("-password")
            // protect the password field in Mongoose/MongoDB so it won't return in a query/result
            req.user = await User.findById(decoded.id).select('-password')

            next()

        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }

})

export { protect }
