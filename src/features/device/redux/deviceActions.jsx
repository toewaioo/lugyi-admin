// src/features/devices/redux/deviceActions.js
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
  } from './deviceConstant';
  import { getDevices, getDeviceById, createDevice, updateDevice, deleteDevice } from './deviceApi';
  
  // Action to fetch all devices
  export const fetchDevices = (page = 1, perPage = 20) => async (dispatch) => {
    dispatch({ type: FETCH_DEVICES_REQUEST });
    try {
      const data = await getDevices(page, perPage);
      dispatch({
        type: FETCH_DEVICES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_DEVICES_FAILURE,
        payload: error,
      });
    }
  };
  
  // Action to fetch a single device by ID
  export const fetchDeviceById = (id) => async (dispatch) => {
    dispatch({ type: FETCH_DEVICE_BY_ID_REQUEST });
    try {
      const data = await getDeviceById(id);
      dispatch({
        type: FETCH_DEVICE_BY_ID_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_DEVICE_BY_ID_FAILURE,
        payload: error,
      });
    }
  };
  
  // Action to create a new device
  export const createNewDevice = (deviceData) => async (dispatch) => {
    dispatch({ type: CREATE_DEVICE_REQUEST });
    try {
      const newDevice = await createDevice(deviceData);
      dispatch({
        type: CREATE_DEVICE_SUCCESS,
        payload: newDevice,
      });
      return Promise.resolve(newDevice);
    } catch (error) {
      dispatch({
        type: CREATE_DEVICE_FAILURE,
        payload: error,
      });
      return Promise.reject(error);
    }
  };
  
  // Action to update an existing device
  export const updateExistingDevice = (id, deviceData) => async (dispatch) => {
    dispatch({ type: UPDATE_DEVICE_REQUEST });
    try {
      const updatedDevice = await updateDevice(id, deviceData);
      dispatch({
        type: UPDATE_DEVICE_SUCCESS,
        payload: updatedDevice,
      });
      return Promise.resolve(updatedDevice);
    } catch (error) {
      dispatch({
        type: UPDATE_DEVICE_FAILURE,
        payload: error,
      });
      return Promise.reject(error);
    }
  };
  
  // Action to delete a device
  export const deleteDeviceAction = (id) => async (dispatch) => {
    // Renamed to avoid conflict with deviceApi.deleteDevice
    dispatch({ type: DELETE_DEVICE_REQUEST });
    try {
      await deleteDevice(id); // API call
      dispatch({
        type: DELETE_DEVICE_SUCCESS,
        payload: id, // Pass the ID so the reducer can remove it from the list
      });
      return Promise.resolve(id);
    } catch (error) {
      dispatch({
        type: DELETE_DEVICE_FAILURE,
        payload: error,
      });
      return Promise.reject(error);
    }
  };
  
  // Removed VIP specific actions
  // export const updateDeviceStatus = (deviceId, isVip) => async (dispatch) => { /* ... */ };