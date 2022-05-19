import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { saveShippingAddress } from '../actions/cartActions'


const ShippingScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    // *** fix warning of : uncontrolled component changing to be controlled
    // the inputs is controlled by an onChange handler but lack a value property equal to one of the piece of state
    // the initial shippingAddress will be null, so set a default state value of ""
    const [address, setAddress] = useState(shippingAddress.address || "")
    const [suburb, setSuburb] = useState(shippingAddress.Suburb || "")
    const [postCode, setPostCode] = useState(shippingAddress.postCode || "")
    const [country, setCountry] = useState(shippingAddress.country || "")



    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, suburb, postCode, country }))
        navigate('/payment')
    }

    return (
        <FormContainer>
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter address'
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='suburb'>
                    <Form.Label>Suburb</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter Suburb'
                        value={suburb}
                        required
                        onChange={(e) => setSuburb(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='postCode'>
                    <Form.Label>Post Code</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter post code'
                        value={postCode}
                        required
                        onChange={(e) => setPostCode(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='country'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter country'
                        value={country}
                        required
                        onChange={(e) => setCountry(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen