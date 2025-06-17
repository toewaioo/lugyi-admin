// src/features/devices/redux/deviceReducer.js
import {
  FETCH_DEVICES_REQUEST,
  FETCH_DEVICES_SUCCESS,
  FETCH_DEVICES_FAILURE,
  FETCH_DEVICE_BY_ID_REQUEST,
  FETCH_DEVICE_BY_ID_SUCCESS,
  FETCH_DEVICE_BY_ID_FAILURE,
  CREATE_DEVICE_REQUEST,
  CREATE_DEVICE_SUCCESS,
  CREATE_DEVICE_FAILURE,
  UPDATE_DEVICE_REQUEST,
  UPDATE_DEVICE_SUCCESS,
  UPDATE_DEVICE_FAILURE,
  DELETE_DEVICE_REQUEST,
  DELETE_DEVICE_SUCCESS,
  DELETE_DEVICE_FAILURE,
} from "./deviceConstant";

const initialState = {
  devices: [],
  selectedDevice: null, // New state for single device details/edit
  pagination: {
    total: 0,
    per_page: 20,
    current_page: 1,
    last_page: 1,
  },
  loading: false,
  error: null,
};

const deviceReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DEVICES_REQUEST:
    case FETCH_DEVICE_BY_ID_REQUEST:
    case CREATE_DEVICE_REQUEST:
    case UPDATE_DEVICE_REQUEST:
    case DELETE_DEVICE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_DEVICES_SUCCESS:
      return {
        ...state,
        loading: false,
        devices: action.payload.devices,
        pagination: action.payload.pagination,
        error: null,
      };

    case FETCH_DEVICE_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedDevice: action.payload,
        error: null,
      };

    case CREATE_DEVICE_SUCCESS:
      return {
        ...state,
        loading: false,
        devices: [action.payload, ...state.devices], // Add new device to the top of the list
        error: null,
      };

    case UPDATE_DEVICE_SUCCESS:
      return {
        ...state,
        loading: false,
        devices: state.devices.map((device) =>
          device.id === action.payload.id ? action.payload : device
        ),
        selectedDevice:
          state.selectedDevice?.id === action.payload.id
            ? action.payload
            : state.selectedDevice,
        error: null,
      };

    case DELETE_DEVICE_SUCCESS:
      return {
        ...state,
        loading: false,
        devices: state.devices.filter((device) => device.id !== action.payload), // Filter out the deleted device
        error: null,
      };

    case FETCH_DEVICES_FAILURE:
    case FETCH_DEVICE_BY_ID_FAILURE:
    case CREATE_DEVICE_FAILURE:
    case UPDATE_DEVICE_FAILURE:
    case DELETE_DEVICE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default deviceReducer;
