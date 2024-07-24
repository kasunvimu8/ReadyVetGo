import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/reducers';
import authMiddleware from '@/middlewares/authentication.middleware.ts';

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authMiddleware),
});

export default store;