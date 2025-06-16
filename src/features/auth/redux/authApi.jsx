import api from '../../../services/api';

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data; // Should contain api_token
  } catch (error) {
    throw error.response?.data || error.message;
  }
};