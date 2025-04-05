import Vapi from "@vapi-ai/web";
import { envConfig } from "@/config/env.config";

// Initialize Vapi with the public key
const apiKey = envConfig.vapi.token;

if (!apiKey) {
  console.error(
    "Vapi API key is missing. Please check your environment variables."
  );
}

// Create a client-side only Vapi instance
let vapi: any;

// This code will only run on the client side
if (typeof window !== "undefined") {
  // Determine if we're in development or production
  const isDevelopment = process.env.NODE_ENV === "development";

  // Create Vapi instance with configuration
  try {
    // Override fetch to force all requests through our proxy
    const originalFetch = window.fetch;
    window.fetch = function (url: RequestInfo | URL, options?: RequestInit) {
      // If this is a Vapi API call, redirect it to our proxy
      if (typeof url === "string" && url.includes("api.vapi.ai")) {
        console.log("Intercepting Vapi API call to:", url);
        const newUrl = window.location.origin + "/api/vapi-proxy";
        console.log("Redirecting to proxy:", newUrl);
        return originalFetch(newUrl, options);
      }
      // Otherwise, use the original fetch
      return originalFetch(url, options);
    };

    vapi = new Vapi({
      apiKey: apiKey,
      debug: true, // Enable debug mode for more detailed logs
      host: window.location.origin + "/api/vapi-proxy", // Use our proxy to avoid CORS issues
    });

    // Log Vapi initialization
    console.log("Vapi initialized with:", {
      apiKey: apiKey
        ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}`
        : "[KEY MISSING]",
      host: window.location.origin + "/api/vapi-proxy",
      fetchOverridden: true,
    });
  } catch (error) {
    console.error("Error initializing Vapi:", error);
    vapi = {};
  }
} else {
  // Server-side placeholder
  vapi = {};
}

export { vapi };
