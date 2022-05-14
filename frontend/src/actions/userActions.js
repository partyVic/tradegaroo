import axios from 'axios'
import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL } from "../constants/userConstants"

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