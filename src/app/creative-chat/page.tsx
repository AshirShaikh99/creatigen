"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreativeChatPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard with a query parameter to open Creative Chat
    router.push("/dashboard?view=creative-chat");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#A78BFA] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-400">Redirecting to Creative Chat...</p>
      </div>
    </div>
  );
}
