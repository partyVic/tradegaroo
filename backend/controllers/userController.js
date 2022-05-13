// handle async error 
// Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email: email })

    // check if the user exists and match the password
    // beware call the Schema Method on a user instance (user.matchPassword)"lower case user" and not from the model (User.matchPassword)"capital User"
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401) // 401 is unauthorized
        throw new Error('Invalid email or password')
    }
})



// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id) // req.user data is from authMiddleware once user is loggin

    // if the user is loggin
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})



export { authUser, getUserProfile }


// req.body userfull tips:
// express deprecated res.send(status, body): Use res.status(status).send(body)
// use {} to wrap if needs to send more than one variable
// res.send({email, password}) 