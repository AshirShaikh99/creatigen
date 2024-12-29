import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { message, query_type, prompt, context_filter } =
      await request.json();

    const payload = {
      message,
      query_type,
      prompt,
      ...(context_filter && { context_filter }), // Add context_filter only if it's provided
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/c28bd98c-5a1c-4bad-94be-718be1a32ec9/chat/agent/key3`,
      payload
    );

    console.log("Great, we got it:", response.data.response);

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
