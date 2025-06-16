import api from '../../../services/api';

export const getUsers = async () => {
  try {
    const response = await api.get('/users'); // Adjust endpoint as per your Laravel API
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ... similarly for updateUser, deleteUser