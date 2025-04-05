// providers.tsx

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/app/lib/store";
import { Toaster } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
        persistor={persistor}
      >
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
