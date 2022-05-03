//createStore is deprecated, use configureStore instead
import { configureStore } from '@reduxjs/toolkit'
import { productListReducer } from './reducers/productReducers'

const initialState = {}

const store = configureStore({
    reducer: {
        productList: productListReducer
    },
    initialState,
    middleware: [],
    devTools: process.env.NODE_ENV !== 'production', //only show devTools when in production
})

export default store