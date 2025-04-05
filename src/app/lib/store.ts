import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import chatReducer from "./messages/messageSlice";
import knowledgebaseReducer from "./knowledgebase/knowledgebaseSlice";

// Check if we need to purge the persisted state
// This is a simple approach to handle breaking changes in state structure
const CURRENT_VERSION = "1.0.0"; // Update this when your state structure changes
const STORAGE_VERSION_KEY = "redux_state_version";

const shouldPurgeState = async () => {
  try {
    const storedVersion = await storage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CURRENT_VERSION) {
      console.log(
        `State version changed from ${storedVersion} to ${CURRENT_VERSION}, purging state`
      );
      await storage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      return true;
    }
    return false;
  } catch (e) {
    console.error("Error checking state version:", e);
    await storage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    return true;
  }
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["chat", "knowledgebase"], // Specify which reducers to persist
};

const rootReducer = combineReducers({
  chat: chatReducer,
  knowledgebase: knowledgebaseReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Check if we need to purge the state
shouldPurgeState().then((shouldPurge) => {
  if (shouldPurge) {
    console.log("Purging persisted state due to version change");
    persistor.purge();
  }
});

console.log("Store initialized:", store.getState());
console.log("Persistor initialized:", persistor);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
