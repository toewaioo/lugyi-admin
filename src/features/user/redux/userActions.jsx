import {
    GET_USERS_REQUEST,
    GET_USERS_SUCCESS,
    GET_USERS_FAILURE,
    // ... other constants
  } from './userConstants';
  import { getUsers } from './userApi';
  
  export const fetchUsers = () => async (dispatch) => {
    dispatch({ type: GET_USERS_REQUEST });
    try {
      const data = await getUsers();
      dispatch({
        type: GET_USERS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_USERS_FAILURE,
        payload: error,
      });
    }
  };
  
  // ... similarly for createUser, updateUser, deleteUser actions