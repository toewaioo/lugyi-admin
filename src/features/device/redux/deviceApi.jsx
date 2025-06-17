// src/features/devices/redux/deviceApi.js
import api from '../../../services/api'; // Ensure this path is correct for your Axios instance

// Fetch all devices with pagination
export const getDevices = async (page = 1, perPage = 20) => {
  try {
    const response = await api.get('/devices', {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching devices:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Fetch a single device by ID
export const getDeviceById = async (id) => {
  try {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching device with ID ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Create a new device
export const createDevice = async (deviceData) => {
  try {
    const response = await api.post('/devices', deviceData);
    return response.data;
  } catch (error) {
    console.error('Error creating device:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Update an existing device
export const updateDevice = async (id, deviceData) => {
  try {
    const response = await api.put(`/devices/${id}`, deviceData);
    return response.data;
  } catch (error) {
    console.error(`Error updating device with ID ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Delete a device
export const deleteDevice = async (id) => {
  try {
    await api.delete(`/devices/${id}`);
    return id; // Return the ID of the deleted device
  } catch (error) {
    console.error(`Error deleting device with ID ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Removed VIP specific API calls
// export const updateDeviceVipStatus = async (deviceId, isVip) => { /* ... */ };