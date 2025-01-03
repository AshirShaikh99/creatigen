import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const payload = {
      contents: [
        {
          parts: [{ text: message }],
        },
      ],
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDSk7IgnHDSrW4iws0Qb-CVrX_VC2iPexM`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Great, we got it:", response.data);

    // Send the AI response back to the client
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}