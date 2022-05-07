import React, { useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart } from '../actions/cartActions'

const CartScreen = () => {
    const params = useParams()
    const location = useLocation()

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

    return (
        <div>CartScreen</div>
    )
}

export default CartScreen