import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'


const OrderScreen = () => {
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()

    const orderId = params.id

    // used for Paypal SDK config
    // add to state is to update when the Paypal sdk on HTML is loading ready
    const [sdkReady, setSdkReady] = useState(false)

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const orderDetails = useSelector((state) => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector((state) => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay  // destructuring, rename loading to loadingPay success to successPay

    const orderDeliver = useSelector((state) => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver



    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }

        // setting Paypal SDK config to HTML
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')    // destructuring, same as const clientId = (await axios.get('/api/config/paypal')).data

            // create an Paypal SDK script element in HTML
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=AUD`
            script.async = true
            script.onload = () => {     // onload Event: Execute a JavaScript immediately after a page has been loaded
                setSdkReady(true)
            }
            document.body.appendChild(script)  // add the script to HTML body
        }



        if (!order || successPay || successDeliver || order._id !== orderId) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))


            // if(order.isPaid === false) instead of if(!order.isPaid). 
            // Because initially "order" is an empty object, in this case order.isPaid return undefined instead of false
        } else if (order.isPaid === false) {   // if customer hasn't paid the order
            if (!window.paypal) {  // check if the Paypal script is beening loaded. when script is loaded, the SDK will add paypal object to window. console.log(window.paypal)
                addPayPalScript()  // add the paypal script (and sdk ready)
            } else {
                setSdkReady(true)  // if page has loaded with paypal, then just set the sdk ready
            }
        }
    },
        [dispatch, order, orderId, navigate, successPay, userInfo, successDeliver])



    // paymentResult is returned from Paypal
    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult)
        dispatch(payOrder(orderId, paymentResult))
    }


    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }

    return (
        loading
            ? <Loader />
            : error
                ? <Message variant='danger'>{error}</Message>
                : <>
                    <h1>Order {order._id}</h1>

                    <Row>
                        <Col md={8}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2>Shipping</h2>
                                    <p>
                                        <strong>Name: </strong> {order.user.name}
                                    </p>
                                    <p>
                                        <strong>Email: </strong>{' '}
                                        <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                                    </p>
                                    <p>
                                        <strong>Address: </strong>
                                        {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                        {order.shippingAddress.postalCode}{' '}
                                        {order.shippingAddress.country}
                                    </p>
                                    {order.isDelivered
                                        ? (
                                            <Message variant='success'>
                                                Delivered on {order.deliveredAt}
                                            </Message>)
                                        : (
                                            <Message variant='danger'>Not Delivered</Message>)}
                                </ListGroup.Item>


                                <ListGroup.Item>
                                    <h2>Payment Method</h2>
                                    <p>
                                        <strong>Method: </strong>
                                        {order.paymentMethod}
                                    </p>
                                    {order.isPaid
                                        ? (
                                            <Message variant='success'>Paid on {order.paidAt}</Message>)
                                        : (
                                            <Message variant='danger'>Not Paid</Message>)}
                                </ListGroup.Item>


                                <ListGroup.Item>
                                    <h2>Order Items</h2>
                                    {order.orderItems.length === 0
                                        ? (<Message>Order is empty</Message>)
                                        : (
                                            <ListGroup variant='flush'>
                                                {order.orderItems.map((item) => (
                                                    <ListGroup.Item key={item.product}>
                                                        <Row>
                                                            <Col md={1}>
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    fluid
                                                                    rounded
                                                                />
                                                            </Col>
                                                            <Col>
                                                                <Link to={`/product/${item.product}`}>
                                                                    {item.name}
                                                                </Link>
                                                            </Col>
                                                            <Col md={4}>
                                                                {item.qty} x ${item.price} = ${item.qty * item.price}
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h2>Order Summary</h2>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Items</Col>
                                            <Col>${order.itemsPrice.toFixed(2)}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Shipping</Col>
                                            <Col>${order.shippingPrice.toFixed(2)}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Tax</Col>
                                            <Col>${order.taxPrice.toFixed(2)}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Total</Col>
                                            <Col>${order.totalPrice.toFixed(2)}</Col>
                                        </Row>
                                    </ListGroup.Item>


                                    {order.isPaid === false && (
                                        <ListGroup.Item>
                                            {loadingPay && <Loader />}
                                            {!sdkReady ? (
                                                <Loader />
                                            ) : (
                                                <PayPalButton
                                                    amount={order.totalPrice}
                                                    currency='AUD'
                                                    onSuccess={successPaymentHandler}
                                                />
                                            )}
                                        </ListGroup.Item>
                                    )}


                                    {loadingDeliver && <Loader />}

                                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                        <ListGroup.Item>
                                            <Button
                                                type='button'
                                                className='btn btn-block'
                                                onClick={deliverHandler}
                                            >
                                                Mark As Delivered
                                            </Button>
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </>
    )
}

export default OrderScreen