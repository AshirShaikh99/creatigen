import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = req.headers.get("user-id") || "test-user"; // Fallback to test-user if not provided

    console.log("Sending diagram request to backend:", {
      message: body.prompt,
      userId,
    });

    const response = await fetch("http://localhost:8000/api/v1/diagram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
      },
      body: JSON.stringify({
        message: body.prompt, // Map prompt to message expected by backend
        options: body.options || {},
      }),
    });

    const responseText = await response.text();
    console.log("Raw backend response:", responseText);

    let data;
    try {
      // Try to parse as JSON
      data = JSON.parse(responseText);
      console.log("Parsed backend response as JSON:", data);
    } catch {
      // If not JSON, treat as plain text (could be direct mermaid syntax)
      console.log("Backend response is not JSON, using as raw syntax");
      data = { syntax: responseText };
    }

    if (!response.ok) {
      console.error("Diagram API error:", data);
      return NextResponse.json(
        { error: "Backend API Error", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Diagram API Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
