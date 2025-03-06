"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useNavigateBack() {
  const router = useRouter();

  const navigateBack = useCallback(() => {
    // Try to navigate back in browser history
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to dashboard if there's no history
      router.push("/dashboard");
    }
  }, [router]);

  return navigateBack;
}
