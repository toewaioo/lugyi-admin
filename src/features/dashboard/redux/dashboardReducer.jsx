// src/features/dashboard/redux/dashboardReducer.js
import {
  FETCH_OVERVIEW_REQUEST,
  FETCH_OVERVIEW_SUCCESS,
  FETCH_OVERVIEW_FAILURE,
  SET_TIME_RANGE,
} from "./dashboardConstants";

const initialState = {
  data: null,
  timeRange: "week", // Default time range
  loading: false,
  error: null,
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_OVERVIEW_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_OVERVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case FETCH_OVERVIEW_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        data: null, // Clear data on error
      };
    case SET_TIME_RANGE:
      return {
        ...state,
        timeRange: action.payload,
      };
    default:
      return state;
  }
};

export default dashboardReducer;
