import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import searchFormReducer from '../features/searchForm/searchFormSlice';
import headerReducer from '../features/header/headerSlice';
import modalShowSlice from '../features/header/modalShowSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    searchForm: searchFormReducer,
    header: headerReducer,
    modalShow: modalShowSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
