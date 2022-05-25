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
            throw new Error("Email already in use");
        } else {
            user.email = req.body.email || user.email
        }

        //check if a password is sent and modify
        if (req.body.password) {
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



// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})   // if current log in user is Admin, can fetch all users from DB
    res.json(users)
})



// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        await user.remove()
        res.json({ message: 'User removed' })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})



// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')  // get the user data with out sending back the password field

    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})



// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        user.name = req.body.name || user.name

        //check if email is sent from req.body and prevent duplicate email
        const userEmailExists = await User.findOne({ email: req.body.email });
        if (userEmailExists) {
            res.status(400); //bad request
            throw new Error("Email already in use");
        } else {
            user.email = req.body.email || user.email
        }

        // If we don't pass a value for isAdmin in our body, req.body.isAdmin won't be defined.
        // Since it's not defined, and user.isAdmin wasn't given a fallback value (like user.name and user.email)
        // an error will get thrown that req.body.isAdmin is a required value we have to send each time we call the userUpdate function.
        user.isAdmin = (req.body.isAdmin === undefined) ? user.isAdmin : req.body.isAdmin

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})



export { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser }


// req.body userfull tips:
// express deprecated res.send(status, body): Use res.status(status).send(body)
// use {} to wrap if needs to send more than one in the body
// res.send({email, password}) 