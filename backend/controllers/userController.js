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



// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400) // bad requests
        throw new Error('User already exists')
    }

    const user = await User.create({
        name,
        email,
        password    // can encrypte the password here without using mongoose middleware to encrypt the password
    })

    // when user is created
    if (user) {
        // 201 something is created
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
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


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id) // req.user data is from authMiddleware once user is loggin

    // if the user is loggin and found
    // modify the user profile
    if (user) {
        user.name = req.body.name || user.name

        //check if email is sent from req.body and prevent duplicate email
        const userEmailExists = await User.findOne({ email: req.body.email });
        if (userEmailExists) {
            res.status(400); //bad request
            throw new Error("Email already in Use");
        } else {
            user.email = req.body.email || user.email
        }

        //check if a password is sent and modify
        if (req.body.password){
            user.password = req.body.password  //password will be encrypted automatically by userModel
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })

    } else {
        res.status(404)
        throw new Error('User not found')
    }
})



export { authUser, registerUser, getUserProfile, updateUserProfile }


// req.body userfull tips:
// express deprecated res.send(status, body): Use res.status(status).send(body)
// use {} to wrap if needs to send more than one in the body
// res.send({email, password}) 