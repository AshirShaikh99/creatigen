"use client";

import React from "react";
import CreativeChatInterface from "@/components/CreativeChatInterface";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreativeChatPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <div className="p-4 pb-2">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="text-xl font-semibold text-white">Creative Chat</h1>
            <p className="text-sm text-gray-400">
              Chat with AI for ideas and creative assistance
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 pb-4">
        <CreativeChatInterface />
      </main>
    </div>
  );
}
