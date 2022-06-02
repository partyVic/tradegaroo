import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product.js'
import Loader from '../components/Loader.js'
import Message from '../components/Message.js'
import { listProducts } from '../actions/productActions.js'

const HomeScreen = () => {
    const params = useParams()

    // useDispatch is used to dispatch or call in an action
    const dispatch = useDispatch()

    // useSelector is used to select parts of the state
    // productList is same as defined in the store reducer
    const productList = useSelector(state => state.productList)
    const { loading, error, products } = productList

    const { keyword } = params

    useEffect(() => {
        dispatch(listProducts(keyword))
    }, [dispatch, keyword])

    return (
        <>
            <h1>Latest Products</h1>
            {loading
                ? <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : <Row>
                        {products.map(product => (
                            <Col sm={12} md={6} lg={4} xl={3} key={product._id} className='align-items-stretch d-flex'>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>}
        </>
    )
}

export default HomeScreen