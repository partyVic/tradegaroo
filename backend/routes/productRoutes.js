import express from 'express'
import asyncHandler from 'express-async-handler' //handle async error
import Product from '../models/productModel.js'

const router = express.Router()

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const products = await Product.find({})
    res.json(products)
}))

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        res.json(product)
    } else {
        // res.status(404).json({ message: 'Product not found' }) // use this before we create custom error handler

        // use this after we created our custom error handlers
        res.status(404)
        throw new Error('Product not found')
    }
}))

export default router