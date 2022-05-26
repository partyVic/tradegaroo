// handle async error 
// Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers
import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'


// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({})
    res.json(products)
})


// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        res.json(product)
    } else {
        // res.status(404).json({ message: 'Product not found' }) // use this before we create custom error handler

        // use this after we created our custom error handlers
        res.status(404)
        throw new Error('Product not found')
    }
})


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        await product.remove()
        res.json({ message: 'Product removed' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

export { getProducts, getProductById, deleteProduct }