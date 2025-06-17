// src/features/subscriptions/redux/subscriptionApi.js
import api from "../../../services/api"; // Ensure this path is correct

export const getSubscriptionKeys = async () => {
  try {
    // Assuming your API endpoint is /subscription-keys
    const response = await api.get("/subscription-keys");
    return response.data; // This should contain the "subscription_keys" array
  } catch (error) {
    console.error(
      "Error fetching subscription keys:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

export const generateSubscriptionKey = async (keyType, maxDevices) => {
  try {
    // Assuming a POST endpoint to generate a key
    const response = await api.post("/create-key", {
      type: keyType,
      max_devices: maxDevices,
    });
    return response.data; // Should return the newly generated key object
  } catch (error) {
    console.error(
      "Error generating subscription key:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

export const deactivateSubscriptionKey = async (key) => {
  try {
    // Assuming a PUT endpoint to deactivate a key by its unique 'key' string
    const response = await api.put(`/subscriptions/${key}/deactivate`);
    return response.data.subscription; // Should return the updated key object
  } catch (error) {
    console.error(
      `Error deactivating key ${key}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};
