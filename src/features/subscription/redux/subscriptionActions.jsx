// src/features/subscriptions/redux/subscriptionActions.js
import {
  FETCH_SUBSCRIPTION_KEYS_REQUEST,
  FETCH_SUBSCRIPTION_KEYS_SUCCESS,
  FETCH_SUBSCRIPTION_KEYS_FAILURE,
  GENERATE_SUBSCRIPTION_KEY_REQUEST,
  GENERATE_SUBSCRIPTION_KEY_SUCCESS,
  GENERATE_SUBSCRIPTION_KEY_FAILURE,
  DEACTIVATE_SUBSCRIPTION_KEY_REQUEST,
  DEACTIVATE_SUBSCRIPTION_KEY_SUCCESS,
  DEACTIVATE_SUBSCRIPTION_KEY_FAILURE,
} from "./subscriptionConstants";
import {
  getSubscriptionKeys,
  generateSubscriptionKey,
  deactivateSubscriptionKey,
} from "./subscriptionApi";

export const fetchSubscriptionKeys = () => async (dispatch) => {
  dispatch({ type: FETCH_SUBSCRIPTION_KEYS_REQUEST });
  try {
    const data = await getSubscriptionKeys();
    dispatch({
      type: FETCH_SUBSCRIPTION_KEYS_SUCCESS,
      payload: data.subscription_keys, // Access the 'subscription_keys' array from the response
    });
  } catch (error) {
    dispatch({
      type: FETCH_SUBSCRIPTION_KEYS_FAILURE,
      payload: error,
    });
  }
};

export const createSubscriptionKey =
  (keyType, maxDevices) => async (dispatch) => {
    dispatch({ type: GENERATE_SUBSCRIPTION_KEY_REQUEST });
    try {
      const newKey = await generateSubscriptionKey(keyType, maxDevices);
      dispatch({
        type: GENERATE_SUBSCRIPTION_KEY_SUCCESS,
        payload: newKey,
      });
      return Promise.resolve(newKey);
    } catch (error) {
      dispatch({
        type: GENERATE_SUBSCRIPTION_KEY_FAILURE,
        payload: error,
      });
      return Promise.reject(error);
    }
  };

export const deactivateSubscription = (key) => async (dispatch) => {
  dispatch({ type: DEACTIVATE_SUBSCRIPTION_KEY_REQUEST });
  try {
    const updatedKey = await deactivateSubscriptionKey(key);
    dispatch({
      type: DEACTIVATE_SUBSCRIPTION_KEY_SUCCESS,
      payload: updatedKey, // The API should return the updated key object
    });
    return Promise.resolve(updatedKey);
  } catch (error) {
    dispatch({
      type: DEACTIVATE_SUBSCRIPTION_KEY_FAILURE,
      payload: error,
    });
    return Promise.reject(error);
  }
};
