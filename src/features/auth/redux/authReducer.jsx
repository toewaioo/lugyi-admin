// src/features/auth/redux/authReducer.js
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  // TOKEN_REFRESH_SUCCESS, // Uncomment if using refresh token actions
  // TOKEN_REFRESH_FAILURE, // Uncomment if using refresh token actions
} from "./authConstants";

const initialState = {
  accessToken: localStorage.getItem("access_token") || null,
  refreshToken: localStorage.getItem("refresh_token") || null,
  isAuthenticated: !!localStorage.getItem("access_token"), // Check if access token exists to determine authentication status
  user: JSON.parse(localStorage.getItem("user_info")) || null, // To store user information
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      console.log(
        "Login successful, updating state with tokens and user info:",
        action.payload
      );
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        user: action.payload.user,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        user: null,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...initialState, // Reset to initial state on logout
      };
    // // Optional: Handle token refresh success/failure
    // case TOKEN_REFRESH_SUCCESS:
    //   return {
    //     ...state,
    //     accessToken: action.payload.accessToken,
    //     refreshToken: action.payload.refreshToken,
    //     error: null,
    //   };
    // case TOKEN_REFRESH_FAILURE:
    //   return {
    //     ...state,
    //     error: action.payload,
    //     // You might want to log out or prompt re-login here
    //   };
    default:
      return state;
  }
};

export default authReducer;
