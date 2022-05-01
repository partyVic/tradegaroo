import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import productRoutes from './routes/productRoutes.js'

dotenv.config()

connectDB()

const app = express()

// used for show the log of requests. Put before any route handlers
app.use(morgan('dev'))


app.get('/', (req, res) => {
    res.send('API is running')
})

// any url link to below address will go to productRoutes
app.use('/api/products', productRoutes)


// middlewares to handle errors, put below all routes
app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 5000

app.listen(
    PORT,
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
)