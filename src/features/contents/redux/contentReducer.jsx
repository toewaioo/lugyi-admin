// src/features/contents/redux/contentReducer.js
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

const initialState = {
  contents: [],
  selectedContent: null,
  loading: false,
  error: null,
};

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTENTS_REQUEST:
    case GET_CONTENT_REQUEST:
    case CREATE_CONTENT_REQUEST:
    case UPDATE_CONTENT_REQUEST:
    case DELETE_CONTENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_CONTENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        contents: action.payload,
        error: null,
      };

    case GET_CONTENT_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedContent: action.payload,
        error: null,
      };

    case CREATE_CONTENT_SUCCESS:
      return {
        ...state,
        loading: false,
        contents: [...state.contents, action.payload], // Add new content to list
        error: null,
      };

    case UPDATE_CONTENT_SUCCESS:
      return {
        ...state,
        loading: false,
        contents: state.contents.map((content) =>
          content.id === action.payload.id ? action.payload : content
        ),
        selectedContent: action.payload, // Update selected content if it matches
        error: null,
      };

    case DELETE_CONTENT_SUCCESS:
      return {
        ...state,
        loading: false,
        contents: state.contents.filter(
          (content) => content.id !== action.payload
        ),
        error: null,
      };

    case GET_CONTENTS_FAILURE:
    case GET_CONTENT_FAILURE:
    case CREATE_CONTENT_FAILURE:
    case UPDATE_CONTENT_FAILURE:
    case DELETE_CONTENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default contentReducer;
