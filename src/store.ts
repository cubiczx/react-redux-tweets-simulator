import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import {
  getTweetsStateFromLocalStorage,
  saveTweetsStateToLocalStorage,
} from "./utils/localStorage";

const tweetsLocalStorageState = getTweetsStateFromLocalStorage();

// Create the Redux store using the reducer function
const store = configureStore({
  reducer: rootReducer,
  preloadedState: tweetsLocalStorageState,
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

store.subscribe(() => {
  saveTweetsStateToLocalStorage(store.getState().tweets);
});

export default store;
