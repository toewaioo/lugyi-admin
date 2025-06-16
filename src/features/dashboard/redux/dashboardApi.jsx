// src/features/dashboard/redux/dashboardApi.js
import api from "../../../services/api"; // Ensure this path is correct

export const getOverviewData = async (timeRange = "week") => {
  try {
    // The API call uses a query parameter for time_range
    const response = await api.get(`/overview?time_range=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching overview data:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};
