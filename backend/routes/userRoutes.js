import express from 'express'
import { authUser, registerUser, getUserProfile, updateUserProfile, getUsers } from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'


const router = express.Router()

router.route('/')
    .post(registerUser)

    // this route is passing 2 middlewares. 1st is protect, 2nd is admin, to check if the current log in user is Admin user
    // admin must put after protect, req.user gets from protect once the user is log in, and then pass to admin
    .get(protect, admin, getUsers)  


router.post('/login', authUser)

router.route('/profile')
    .get(protect, getUserProfile) // protect is a middleware, put into the first argument
    .put(protect, updateUserProfile)


export default router