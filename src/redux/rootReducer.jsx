import { combineReducers } from "redux";
import authReducer from "../features/auth/redux/authReducer";
// import userReducer from '../features/users/redux/userReducer';
import contentReducer from "../features/contents/redux/contentReducer";
import dashboardReducer from "../features/dashboard/redux/dashboardReducer";
import deviceReducer from "../features/device/redux/deviceReducer";
import { sub } from "date-fns";
import subscriptionReducer from "../features/subscription/redux/subscriptionReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  //   users: userReducer,
  contents: contentReducer,
  dashboard: dashboardReducer,
  devices: deviceReducer,
  subscriptions: subscriptionReducer
  // Add other feature reducers here
});

export default rootReducer;
