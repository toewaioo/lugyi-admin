// src/features/subscriptions/redux/subscriptionReducer.js
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

const initialState = {
  subscriptionKeys: [],
  loading: false,
  error: null,
};

const subscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUBSCRIPTION_KEYS_REQUEST:
    case GENERATE_SUBSCRIPTION_KEY_REQUEST:
    case DEACTIVATE_SUBSCRIPTION_KEY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_SUBSCRIPTION_KEYS_SUCCESS:
      return {
        ...state,
        loading: false,
        subscriptionKeys: action.payload,
        error: null,
      };

    case GENERATE_SUBSCRIPTION_KEY_SUCCESS:
      return {
        ...state,
        loading: false,
        subscriptionKeys: [action.payload, ...state.subscriptionKeys], // Add new key to the top
        error: null,
      };

    case DEACTIVATE_SUBSCRIPTION_KEY_SUCCESS:
      return {
        ...state,
        loading: false,
        // Update the key in the list with the new 'is_active' status and potentially 'expires_at'
        subscriptionKeys: state.subscriptionKeys.map((key) =>
          key.key === action.payload.key ? action.payload : key
        ),  
        error: null,
      };

    case FETCH_SUBSCRIPTION_KEYS_FAILURE:
    case GENERATE_SUBSCRIPTION_KEY_FAILURE:
    case DEACTIVATE_SUBSCRIPTION_KEY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default subscriptionReducer;
