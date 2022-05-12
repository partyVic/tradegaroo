// handle async error 
// Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers
import asyncHandler from 'express-async-handler'
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
            token: null
        })
    } else {
        res.status(401) // 401 is unauthorized
        throw new Error('Invalid email or password')
    }
})

export { authUser }


// req.body userfull tips:
// express deprecated res.send(status, body): Use res.status(status).send(body)
// use {} to wrap if needs to send more than one variable
// res.send({email, password}) 