import React, { useEffect } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart } from '../actions/cartActions'

const CartScreen = () => {
    const params = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    // When add a item to cart, it will go to cart page
    // and has the link like http://localhost:3000/cart/626bd794acadc6c4de3d3b07?qty=7

    // And NOT always has a productId, because when just click cart button
    // it will go the the link http://localhost:3000/cart
    const productId = params.id

    // react-router-dom has a useful hook: useLocation() location.search gives the string after ? mark. eg qty=7
    // and there is a good built-in WEB API interface URLSearchParams
    // then we can get the qty from the given link http://localhost:3000/cart/626bd794acadc6c4de3d3b07?qty=7
    const qty = Number(new URLSearchParams(location.search).get('qty'))

    const dispatch = useDispatch()

    //get the cartItems from the state
    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

    useEffect(() => {
        // only dispatch if the link has productId like http://localhost:3000/cart/626bd794acadc6c4de3d3b07?qty=7
        // if just go to cart page, it will NOT has productId. like http://localhost:3000/cart
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const removeFromCartHandler = (id) => {
        console.log('remove')
    }

    const checkoutHandler =()=>{
        navigate('/login?redirect=shipping')
    }

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0
                    ? <Message>Your cart is empty <Link to='/'>Go Back</Link></Message>
                    : (<ListGroup variant='flush'>
                        {cartItems.map(item => (
                            <ListGroup.Item
                                key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>
                                        ${item.price}
                                    </Col>
                                    <Col md={2}>
                                        <Form.Control
                                            className='form-select'
                                            style={{ padding: "0.75rem 0.2rem" }}
                                            as='select'
                                            value={item.qty}
                                            onChange={e => dispatch(addToCart(item.product, Number(e.target.value)))}   //when change the qyt of product, will fire dispatch method
                                        >
                                            {[...Array(item.countInStock).keys()].map(x => (
                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={2}>
                                        <Button
                                            type='button'
                                            variant='light'
                                            onClick={() => removeFromCartHandler(item.product)}
                                        >
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>)}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                            ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn-block'
                                disabled={cartItems.length === 0}
                                onClick={checkoutHandler}
                            >
                                Proceed to Checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>

        </Row>
    )
}

export default CartScreen