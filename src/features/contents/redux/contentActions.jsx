// src/features/contents/redux/contentActions.js
import {
  GET_CONTENTS_REQUEST,
  GET_CONTENTS_SUCCESS,
  GET_CONTENTS_FAILURE,
  GET_CONTENT_REQUEST,
  GET_CONTENT_SUCCESS,
  GET_CONTENT_FAILURE,
  CREATE_CONTENT_REQUEST,
  CREATE_CONTENT_SUCCESS,
  CREATE_CONTENT_FAILURE,
  UPDATE_CONTENT_REQUEST,
  UPDATE_CONTENT_SUCCESS,
  UPDATE_CONTENT_FAILURE,
  DELETE_CONTENT_REQUEST,
  DELETE_CONTENT_SUCCESS,
  DELETE_CONTENT_FAILURE,
} from "./contentConstants";
import {
  createContent,
  getContents,
  getContentById,
  updateContent,
  deleteContent,
} from "./contentApi";

export const createNewContent = (contentData) => async (dispatch) => {
  dispatch({ type: CREATE_CONTENT_REQUEST });
  try {
    const data = await createContent(contentData);
    dispatch({
      type: CREATE_CONTENT_SUCCESS,
      payload: data,
    });
    return Promise.resolve(data); // Return data for potential redirection/feedback
  } catch (error) {
    dispatch({
      type: CREATE_CONTENT_FAILURE,
      payload: error,
    });
    return Promise.reject(error); // Propagate error
  }
};

export const fetchContents = () => async (dispatch) => {
  dispatch({ type: GET_CONTENTS_REQUEST });
  try {
    const data = await getContents();
    dispatch({
      type: GET_CONTENTS_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    dispatch({
      type: GET_CONTENTS_FAILURE,
      payload: error,
    });
  }
};

export const fetchContentById = (id) => async (dispatch) => {
  dispatch({ type: GET_CONTENT_REQUEST });
  try {
    const data = await getContentById(id);
    dispatch({
      type: GET_CONTENT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_CONTENT_FAILURE,
      payload: error,
    });
  }
};

export const updateExistingContent = (id, contentData) => async (dispatch) => {
  dispatch({ type: UPDATE_CONTENT_REQUEST });
  try {
    const data = await updateContent(id, contentData);
    dispatch({
      type: UPDATE_CONTENT_SUCCESS,
      payload: data,
    });
    return Promise.resolve(data);
  } catch (error) {
    dispatch({
      type: UPDATE_CONTENT_FAILURE,
      payload: error,
    });
    return Promise.reject(error);
  }
};

export const deleteExistingContent = (id) => async (dispatch) => {
  dispatch({ type: DELETE_CONTENT_REQUEST });
  try {
    await deleteContent(id);
    dispatch({
      type: DELETE_CONTENT_SUCCESS,
      payload: id, // Pass ID to remove from state
    });
    return Promise.resolve();
  } catch (error) {
    dispatch({
      type: DELETE_CONTENT_FAILURE,
      payload: error,
    });
    return Promise.reject(error);
  }
};
