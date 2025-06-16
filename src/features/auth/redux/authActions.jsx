// src/features/auth/redux/authActions.js
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  TOKEN_REFRESH_SUCCESS, // Uncomment if using refresh token actions
  TOKEN_REFRESH_FAILURE, // Uncomment if using refresh token actions
} from "./authConstants";
import { loginUser } from "./authApi";

export const login = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const data = await loginUser(credentials);
    // Store both access_token and refresh_token
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    // Optionally store user info if needed globally, or fetch it later
    localStorage.setItem("user_info", JSON.stringify(data.user));

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        user: data.user,
      },
    });
    return Promise.resolve(data);
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error,
    });
    return Promise.reject(error);
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_info"); // Clear user info on logout
  dispatch({ type: LOGOUT });
};

// Action to load tokens from storage on app load
export const loadTokensFromStorage = () => (dispatch) => {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  const userInfo = localStorage.getItem("user_info");

  if (accessToken && refreshToken) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: userInfo ? JSON.parse(userInfo) : null,
      },
    });
  }
};

// // Optional: Action for refreshing token
export const refreshAccessToken = (refreshToken) => async (dispatch) => {
  try {
    // Call your refresh token API endpoint here
    const response = await api.post("/refresh-token", {
      refresh_token: refreshToken,
    });
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token); // If refresh token also changes
    dispatch({
      type: TOKEN_REFRESH_SUCCESS,
      payload: {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      },
    });
  } catch (error) {
    dispatch({ type: TOKEN_REFRESH_FAILURE, payload: error });
    dispatch(logout()); // Log out if refresh fails
  }
};
