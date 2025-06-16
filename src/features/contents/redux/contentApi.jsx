// src/features/contents/redux/contentApi.js
import api from "../../../services/api";

// Function to create new content
export const createContent = async (contentData) => {
  try {
    // Assuming your Laravel API endpoint for creating content is /contents
    // Make sure your backend expects multipart/form-data if you handle actual files,
    // otherwise, application/json is fine for URL-based images/files.
    // For this example, we'll assume JSON for simplicity with URLs.
    const response = await api.post("/contents", contentData);
    return response.data;
  } catch (error) {
    // Log the error for debugging
    console.error(
      "Error creating content:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// You'd also add functions for fetching, updating, and deleting content here:
export const getContents = async () => {
  try {
    const response = await api.get("/contents");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getContentById = async (id) => {
  try {
    const response = await api.get(`/contents/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateContent = async (id, contentData) => {
  try {
    const response = await api.put(`/contents/${id}`, contentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteContent = async (id) => {
  try {
    const response = await api.delete(`/contents/${id}`);
    return response.data; // Often empty or success message
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
