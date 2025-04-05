"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { vapi } from "@/lib/vapi.sdk";
import { assistant } from "@/assistants/assistant";
import { Mic, MicOff, Loader2, Globe } from "lucide-react";
import { envConfig } from "@/config/env.config";

export function VoiceTest() {
  const [status, setStatus] = useState<"idle" | "loading" | "active" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startCall = async () => {
    try {
      setStatus("loading");
      setErrorMessage(null);

      console.log("Requesting microphone permission...");
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");

      console.log("Starting Vapi call with assistant:", assistant);
      // Start the call
      const call = await vapi.start(assistant);
      console.log("Call started:", call);

      setStatus("active");
    } catch (error) {
      console.error("Error starting call:", error);
      setStatus("error");

      // Provide more detailed error message
      let errorMsg = error instanceof Error ? error.message : String(error);

      // Add more context based on the error
      if (errorMsg.includes("Permission") || errorMsg.includes("permission")) {
        errorMsg =
          "Microphone permission denied. Please allow microphone access and try again.";
      } else if (errorMsg.includes("CORS") || errorMsg.includes("Origin")) {
        errorMsg =
          "CORS error: The application cannot connect to the voice service due to browser security restrictions.";
      } else if (errorMsg.includes("Load failed")) {
        errorMsg =
          "Failed to connect to the voice service. This may be due to network issues or CORS restrictions.";
      }

      setErrorMessage(errorMsg);
    }
  };

  const stopCall = () => {
    try {
      setStatus("loading");
      vapi.stop();
      setStatus("idle");
    } catch (error) {
      console.error("Error stopping call:", error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  };

  // Function to test the API directly
  const testApiDirectly = async () => {
    try {
      setStatus("loading");
      setErrorMessage(null);

      console.log("Testing API directly...");

      // Get the API key
      const apiKey = envConfig.vapi.token;

      console.log(
        `Using API key: ${
          apiKey
            ? apiKey.substring(0, 5) +
              "..." +
              apiKey.substring(apiKey.length - 5)
            : "MISSING"
        }`
      );

      if (!apiKey) {
        setErrorMessage(
          "API key is missing. Please check your environment variables."
        );
        setStatus("error");
        return;
      }

      // Test through our proxy
      console.log("Testing through proxy...");
      const proxyResponse = await fetch("/api/vapi-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Send an empty object to test the connection
          // The proxy will add the required fields
        }),
      }).catch((error) => {
        console.error("Proxy API fetch error:", error);
        throw new Error(`Proxy API fetch failed: ${error.message}`);
      });

      const proxyData = await proxyResponse.text();
      console.log("Proxy test response:", proxyResponse.status, proxyData);

      setErrorMessage(
        `API test: ${proxyResponse.status} ${proxyData.substring(0, 100)}...`
      );
      setStatus("idle");
    } catch (error) {
      console.error("API test error:", error);
      setStatus("error");
      setErrorMessage(
        `API test error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <div className="p-4 bg-black/20 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Voice Test</h3>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded text-sm text-red-300 max-h-32 overflow-auto">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-center gap-4">
        <Button
          onClick={status === "active" ? stopCall : startCall}
          className={`rounded-full w-16 h-16 ${
            status === "active"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-purple-500 hover:bg-purple-600"
          }`}
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : status === "active" ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>

        <Button
          onClick={testApiDirectly}
          className="rounded-full w-16 h-16 bg-blue-500 hover:bg-blue-600"
          disabled={status === "loading"}
        >
          <Globe className="h-6 w-6" />
        </Button>
      </div>

      <div className="mt-4 text-center text-sm text-gray-400">
        {status === "idle" &&
          "Click mic to start voice chat or globe to test API"}
        {status === "loading" && "Initializing..."}
        {status === "active" && "Voice chat active. Click to stop."}
        {status === "error" && "Error occurred. Try again."}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <div>API Key: {envConfig.vapi.token ? "✓ Available" : "✗ Missing"}</div>
        <div>
          Key:{" "}
          {envConfig.vapi.token
            ? envConfig.vapi.token.substring(0, 5) + "..."
            : "None"}
        </div>
      </div>
    </div>
  );
}
