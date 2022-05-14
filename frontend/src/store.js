//createStore is deprecated, use configureStore instead
import { configureStore } from '@reduxjs/toolkit'
import { productListReducer, productDetailsReducer } from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { userLoginReducer } from './reducers/userReducers'

const reducer = {
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userLogin: userLoginReducer
}

// get cart Items from local storage
const cartItemsFromStorage = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : []

// get userInfo from local storage
const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

const preloadedState = {
    cart: { cartItems: cartItemsFromStorage },
    userLogin: { userInfo: userInfoFromStorage }
}

const store = configureStore({
    reducer,
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production', //only show devTools when in production
})

export default store