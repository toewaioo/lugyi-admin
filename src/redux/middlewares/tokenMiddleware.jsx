// This middleware is more for demonstration of where a token refresh
// logic *could* go if it involves dispatching actions based on token expiry.
// For basic token attachment and 401 handling, Axios interceptors are often sufficient.
import { LOGOUT_SUCCESS } from "../../features/auth/redux/authConstants"; // Assuming you have a LOGOUT_SUCCESS action
import api from "../../services/api"; // Your Axios instance
const tokenMiddleware = (store) => (next) => (action) => {
  const { auth } = store.getState();
  const token = auth.token; // Now, this 'auth.token' *should* be populated from localStorage via the reducer

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }

  if (action.type === LOGOUT_SUCCESS) {
    delete api.defaults.headers.common["Authorization"];
    // localStorage.removeItem('authToken'); // This should now be handled by authActions.js
  }

  return next(action);
};

export default tokenMiddleware;
