import { NextRequest, NextResponse } from "next/server";
import { envConfig } from "@/config/env.config";

// This is a complete proxy for the Vapi API
export async function POST(req: NextRequest) {
  // Add CORS headers to all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
  };
  try {
    // Log the incoming request for debugging
    console.log("Vapi proxy received request");

    // Get the request body
    const body = await req.json();
    console.log(
      "Request body:",
      JSON.stringify(body).substring(0, 100) + "..."
    );

    // For test requests, return a success response without calling the Vapi API
    if (Object.keys(body).length === 0) {
      console.log("Empty request body, returning test response");
      return NextResponse.json(
        { success: true, message: "Proxy connection successful" },
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    }
    const apiKey = envConfig.vapi.token;

    if (!apiKey) {
      console.error("Vapi API key is missing");
      return NextResponse.json(
        { error: "Vapi API key is missing" },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    console.log("Forwarding request to Vapi API");

    // Forward the request to Vapi API
    console.log(
      `Using API key: ${apiKey.substring(0, 5)}...${apiKey.substring(
        apiKey.length - 5
      )}`
    );

    const response = await fetch(`${envConfig.vapi.apiUrl}/call/web`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    // Log the response status for debugging
    console.log(`Vapi API response status: ${response.status}`);

    if (!response.ok) {
      let errorText = "Unknown error";
      try {
        errorText = await response.text();
        console.error(`Vapi API error: ${errorText}`);
      } catch (e) {
        console.error("Could not read error response:", e);
      }

      return NextResponse.json(
        { error: "Error from Vapi API", details: errorText },
        {
          status: response.status,
          headers: corsHeaders,
        }
      );
    }

    // Get the response data
    let data;
    try {
      data = await response.json();
      console.log("Vapi API response received successfully");
    } catch (e) {
      console.error("Error parsing response JSON:", e);
      const text = await response.text();
      console.log("Raw response:", text);
      data = { raw: text };
    }

    // Return the response from Vapi with CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Vapi proxy error:", error);
    return NextResponse.json(
      { error: "Error proxying request to Vapi API", details: String(error) },
      {
        status: 500,
        headers: corsHeaders,
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
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    },
  });
}

// Handle all other HTTP methods
export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function PUT(req: NextRequest) {
  return handleRequest(req);
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req);
}

// Generic handler for all HTTP methods
async function handleRequest(req: NextRequest) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
  };

  try {
    // Extract the path from the URL
    const url = new URL(req.url);
    const path = url.pathname.replace("/api/vapi-proxy", "");

    // Get the API key
    const apiKey = envConfig.vapi.token;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Vapi API key is missing" },
        { status: 500, headers: corsHeaders }
      );
    }

    // Forward the request to Vapi API
    console.log(`Forwarding ${req.method} request to Vapi API: ${path}`);

    // Clone the request to modify it
    const headers = new Headers(req.headers);
    headers.set("Authorization", `Bearer ${apiKey}`);
    headers.set("x-api-key", apiKey);

    // Create the request options
    const requestInit: RequestInit = {
      method: req.method,
      headers: headers,
    };

    // Add body for non-GET requests
    if (req.method !== "GET" && req.method !== "HEAD") {
      const contentType = req.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const body = await req.json();
        requestInit.body = JSON.stringify(body);
      } else {
        const body = await req.text();
        requestInit.body = body;
      }
    }

    // Make the request to Vapi API
    const response = await fetch(
      `${envConfig.vapi.apiUrl}${path || "/call/web"}`,
      requestInit
    );

    // Handle the response
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Return the response
    if (contentType && contentType.includes("application/json")) {
      return NextResponse.json(data, {
        status: response.status,
        headers: corsHeaders,
      });
    } else {
      return new NextResponse(data, {
        status: response.status,
        headers: corsHeaders,
      });
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Error proxying request to Vapi API", details: String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
