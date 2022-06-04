import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product.js'
import Loader from '../components/Loader.js'
import Message from '../components/Message.js'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import { listProducts } from '../actions/productActions.js'

const HomeScreen = () => {
    const params = useParams()

    // useDispatch is used to dispatch or call in an action
    const dispatch = useDispatch()

    // useSelector is used to select parts of the state
    // productList is same as defined in the store reducer
    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages } = productList


    const { keyword } = params
    const pageNumber = params.pageNumber || 1


    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber))
    }, [dispatch, keyword, pageNumber])

    return (
        <>

            {/* When doing a product, don't show the product carousel */}
            {!keyword ? (
                <ProductCarousel />
            ) : (
                <Link to='/' className='btn btn-light'>
                    <strong>Go Back</strong>
                </Link>
            )}

            <h1>Latest Products</h1>
            {loading
                ? <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : (
                        <>
                            {products.length === 0 && <div><h2><strong>Product not found</strong></h2></div>}

                            <Row>
                                {products.map(product => (
                                    <Col sm={12} md={6} lg={4} xl={3} key={product._id} className='align-items-stretch d-flex'>
                                        <Product product={product} />
                                    </Col>
                                ))}
                            </Row>

                            <Paginate
                                pages={pages}
                                page={page}
                                keyword={keyword ? keyword : ''}
                            />
                        </>
                    )}
        </>
    )
}

export default HomeScreen