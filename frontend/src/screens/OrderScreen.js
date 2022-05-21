import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails } from '../actions/orderActions'


const OrderScreen = () => {
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()

    const orderId = params.id

    const orderDetails = useSelector((state) => state.orderDetails)
    const { order, loading, error } = orderDetails

    useEffect(() => {
        dispatch(getOrderDetails(orderId))
    }, [orderId])



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
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </>
    )
}

export default OrderScreen