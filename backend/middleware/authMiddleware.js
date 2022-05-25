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



// Check is current log in user is Admin
const admin = (req, res, next) => {

    // Lecture 67 Question:
    // Why req.user in protect middleware instead of req.body.user ?
    // Confused on why we use req.user instead of storing it in the locals field. How do we pass variables to the next middleware?

    // Answer:
    // After we verify the token we set: req.user = await User.findById(decoded.id).select('-password')
    // We have the request object available throughout the middleware chain. 
    // Assigning the user as a property to it makes it available to the next middlewares in the app flow. 
    // This is why we do not need to set it to res.locals.
    if (req.user && req.user.isAdmin) {  //once the user is log in, it will has the req.user
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as an admin')
    }
}

export { protect, admin }
