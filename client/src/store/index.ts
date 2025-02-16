import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './itemSlice';
import draftReducer from './draftSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    draft: draftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;