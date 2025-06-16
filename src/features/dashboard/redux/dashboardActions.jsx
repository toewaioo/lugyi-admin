// src/features/dashboard/redux/dashboardActions.js
import {
    FETCH_OVERVIEW_REQUEST,
    FETCH_OVERVIEW_SUCCESS,
    FETCH_OVERVIEW_FAILURE,
    SET_TIME_RANGE,
  } from './dashboardConstants';
  import { getOverviewData } from './dashboardApi';
  
  export const fetchOverviewData = (timeRange) => async (dispatch) => {
    dispatch({ type: FETCH_OVERVIEW_REQUEST });
    try {
      const data = await getOverviewData(timeRange);
      dispatch({
        type: FETCH_OVERVIEW_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_OVERVIEW_FAILURE,
        payload: error,
      });
    }
  };
  
  export const setDashboardTimeRange = (timeRange) => ({
    type: SET_TIME_RANGE,
    payload: timeRange,
  });