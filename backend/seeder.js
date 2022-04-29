import mongoose from "mongoose";
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        const createdUsers = await User.insertMany(users)

        //get admin user from createdUsers array, and admin user will be index 0 
        const adminUser = createdUsers[0]._id

        //add admin user to all products
        const sampleProducts = products.map(product => {
            return { ...product, user: adminUser }
        })

        await Product.insertMany(sampleProducts)

        console.log('Data Imported!'.green.inverse)

        //exit node.js process using below code
        process.exit()

    } catch (error) {
        console.log(`${error}`.red.inverse)

        //passing 1 when exit with failure
        process.exit(1)
    }
}

const destoryData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log('Data Destroyed!'.red.inverse)

        //exit node.js process using below code
        process.exit()

    } catch (error) {
        console.log(`${error}`.red.inverse)

        //passing 1 when exit with failure
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    destoryData()
} else {
    importData()
}