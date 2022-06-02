// handle async error 
// Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers
import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'


// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {

    const pageSize = 10     // For Pagination, setting to show how many items per page
    const page = Number(req.query.pageNumber) || 1      // Used for the query string(?pageNumber=1or2...), what the certain page shows the items. Always need to check || 1, at least 1 page

    // Why hit backend for the product search?
    // Answer: In real world scenario you will never fetch all products. You will use pagination and fetch page by page. 
    // This means that in your redux store you have only a small portion of all of your products and search wont be accurate. Thats why we need to hit endpoint and search trough all database.

    // keyword search by name:
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,      // $regex is from MongoDB. Provides regular expression capabilities for pattern matching strings in queries.
                $options: 'i',                  // Case insensitivity to match upper and lower cases. 
            },
        }
        : {}

    // Example 1: Use the logical OR using mongoose to achieve Keyword searches by Name and Brand
    // const keyword = req.query.keyword
    //     ? {
    //         $or: [
    //             {
    //                 name: {
    //                     $regex: req.query.keyword,
    //                     $options: "i",
    //                 },
    //             },
    //             {
    //                 brand: {
    //                     $regex: req.query.keyword,
    //                     $options: "i",
    //                 },
    //             },
    //         ],
    //     }
    //     : {};


    //Example2: How to query multiple fields
    // const keywordName = req.query.keyword ? {
    //     name: {
    //         $regex: req.query.keyword,
    //         $options: 'i'
    //     }
    // } : {}

    // const keywordBrand = req.query.keyword ? {
    //     brand: {
    //         $regex: req.query.keyword,
    //         $options: 'i'
    //     }
    // } : {}

    // const keywordDescription = req.query.keyword ? {
    //     description: {
    //         $regex: req.query.keyword,
    //         $options: 'i'
    //     }
    // } : {}

    // const keywordCategory = req.query.keyword ? {
    //     category: {
    //         $regex: req.query.keyword,
    //         $options: 'i'
    //     }
    // } : {}


    // const products = await Product.find({
    //     $or: [
    //         { ...keywordName },
    //         { ...keywordBrand },
    //         { ...keywordDescription },
    //         { ...keywordCategory }
    //     ]
    // })


    // ***** mongoose Model.countDocuments(). Counts number of documents matching filter in a database collection. 
    const count = await Product.countDocuments({ ...keyword })  // If not in search, will be ({}). Count all the documents.


    // ***** mongoose advanced methods.
    const products = await Product.find({ ...keyword })

        // limit() : will return how many docements limited by page size (if pageSize = 2, return 2 products).
        .limit(pageSize)

        // skip(): is telling it how many products to skip. 
        // skip makes sure we get the right products (for example, if we are on page 2 we get the next 2 products).
        // Examples: 
        // Page 1:  2*(1-1) = 0, so skip 0 products. 
        // Page 2:  2*(2-1) = 2, so skip 2 products.
        .skip(pageSize * (page - 1))

        //sort(): takes an object as parameter where the values are 1 or -1
        // Use -1 for descending order and 1 for ascending
        // eg: sort({firstName: 1, lastName:-1 ,email:1,createdAt:1, updatedAt:1 })
        .sort({ createdAt: -1 })


    // ***** if we have 4 products, count = 4, pageSize = 2. So pages would be 4 / 2 = 2 pages
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
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



// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})



// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
    } = req.body

    const product = await Product.findById(req.params.id)


    // If the user just wants to update ONLY the name and description, 
    // then he should be able to do so without providing the values for the rest of the properties.
    // ***** We can do a simple check for that using the ?? operator. *****
    if (product) {
        product.name = name ?? product.name
        product.price = price ?? product.price
        product.description = description ?? product.description
        product.image = image ?? product.image
        product.brand = brand ?? product.brand
        product.category = category ?? product.category
        product.countInStock = countInStock ?? product.countInStock

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})



// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()    //r.user is stored as object id in productModel
        )

        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Product already reviewed')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        }

        product.reviews.push(review)

        product.numReviews = product.reviews.length

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length

        await product.save()
        res.status(201).json({ message: 'Review added' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview }