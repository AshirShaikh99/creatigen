import { NextRequest, NextResponse } from "next/server";
import { envConfig } from "@/config/env.config";

export async function POST(req: NextRequest) {
  try {
    // Log the incoming request for debugging
    console.log("Vapi call/web proxy received request");
    
    const body = await req.json();
    const apiKey = envConfig.vapi.token;
    
    if (!apiKey) {
      console.error("Vapi API key is missing");
      return NextResponse.json(
        { error: "Vapi API key is missing" },
        { status: 500 }
      );
    }

    console.log("Forwarding request to Vapi API call/web endpoint");
    
    // Forward the request to Vapi API
    const response = await fetch(`${envConfig.vapi.apiUrl}/call/web`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    // Log the response status for debugging
    console.log(`Vapi API call/web response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Vapi API call/web error: ${errorText}`);
      return NextResponse.json(
        { error: "Error from Vapi API", details: errorText },
        { 
          status: response.status,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          }
        }
      );
    }

    // Get the response data
    const data = await response.json();
    console.log("Vapi API call/web response received successfully");

    // Return the response from Vapi with CORS headers
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      }
    });
  } catch (error) {
    console.error("Vapi call/web proxy error:", error);
    return NextResponse.json(
      { error: "Error proxying request to Vapi API call/web", details: String(error) },
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
      }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    },
  });
}
