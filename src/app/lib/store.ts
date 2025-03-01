import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import chatReducer from "./messages/messageSlice";
import knowledgebaseReducer from "./knowledgebase/knowledgebaseSlice";

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
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

console.log("Store initialized:", store.getState());
console.log("Persistor initialized:", persistor);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
