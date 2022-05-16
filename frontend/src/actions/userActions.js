import axios from 'axios'
import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_REGISTER_FAIL_CLEARING_STATE } from "../constants/userConstants"

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        })

        // when we sending data, we want to send in the headers, a content type of application
        // also where we'll pass the token for protected routes, set the authorization here for the token
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post(
            '/api/users/login',
            { email, password },
            config      // 3rd argument for the config
        )

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,

            // generic way to write the payload with error message
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        })
    }
}


export const logout = () => (dispatch) => {
    localStorage.removeItem("userInfo")
    dispatch({ type: USER_LOGOUT })
}


export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST
        })

        // when we sending data, we want to send in the headers, a content type of application
        // also where we'll pass the token for protected routes, set the authorization here for the token
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post(
            '/api/users',
            { name, email, password },
            config      // 3rd argument for the config
        )

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })

        // after reigster, log the user in right away when they register
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,

            // generic way to write the payload with error message
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        })
    }
}

// if user register has error, will show on the screen
// clear the error message while user register successfully
export const userRegisterErrorClearingActionCreator = () => async (dispatch) => {
    dispatch({
      type: USER_REGISTER_FAIL_CLEARING_STATE,
    });
  };