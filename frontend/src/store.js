//createStore is deprecated, use configureStore instead
import { configureStore } from '@reduxjs/toolkit'

const initialState = {}

const store = configureStore({
    reducer: {},
    initialState,
    middleware: [],
    devTools: process.env.NODE_ENV !== 'production', //only show devTools when in production
})

export default store