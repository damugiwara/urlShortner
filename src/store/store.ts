import { configureStore } from '@reduxjs/toolkit';
import { urlApi } from '../services/api';

export const store = configureStore({
  reducer: {
    [urlApi.reducerPath]: urlApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(urlApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;