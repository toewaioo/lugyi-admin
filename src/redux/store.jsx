import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import tokenMiddleware from './middlewares/tokenMiddleware';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tokenMiddleware), // Enable Redux DevTools in development
});