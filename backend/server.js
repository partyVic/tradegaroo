import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import * as cloudinary from 'cloudinary'  // Cloudinary does NOT support ES6 module, so use this way to make it work
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

connectDB()

const app = express()

app.use(express.json()) // allow us to accept JSON data in the req.body

// used for show the log of requests. Put before any route handlers
// app.use(morgan('dev'))

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})




// ---------- Below all are routes -------------------

app.get('/', (req, res) => {
    res.send('API is running')
})

// any url link to below address will go to productRoutes/userRoutes
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)


// Paypal config route
// when ready to make the payment, will hit this route and fetch this client ID in order to implement Paypal
app.get('/api/config/paypal', (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID)
)


// middlewares to handle errors, put below all routes
app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 5000

app.listen(
    PORT,
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
)