import { combineReducers } from "redux";
import authReducer from "../features/auth/redux/authReducer";
// import userReducer from '../features/users/redux/userReducer';
import contentReducer from "../features/contents/redux/contentReducer";
import dashboardReducer from "../features/dashboard/redux/dashboardReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  //   users: userReducer,
  contents: contentReducer,
  dashboard: dashboardReducer,
  // Add other feature reducers here
});

export default rootReducer;
