import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body

    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        })

        const createdOrder = await order.save()

        res.status(201).json(createdOrder)
    }
})


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {

    // use populate() to get the user's name and email that's associated with this order
    // here: populate from 'user', and get name and email field. Make sure there a space between name & email
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    )

    // check if the request was from an admin or if the order user ID was equal to the request user ID
    // *** One would expect to be able to compare order.user._id === req.user._id but this didn't work
    // *** check with https://stackoverflow.com/questions/11060213/mongoose-objectid-comparisons-fail-inconsistently
    // alternate solution: if (order && order.user._id.toString() !== req.user._id.toString())
    if (order && (req.user.isAdmin || order.user._id.equals(req.user._id))) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})



// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()

        // below will be return from paypal response when front end submitted the payment to paypal
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        }

        const updatedOrder = await order.save()

        res.json(updatedOrder)

    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})



// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
})



// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name') // pupulate from user model, get id & name field associated with the order
    res.json(orders)
})


export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders }