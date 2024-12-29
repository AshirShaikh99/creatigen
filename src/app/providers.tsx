// providers.tsx

"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/app/lib/store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      {/* Make sure to persist the state on page load */}
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
