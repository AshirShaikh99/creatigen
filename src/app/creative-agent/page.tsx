"use client";

import React, { useState, useEffect } from "react";
import CreativeAgentInterface from "@/components/CreativeAgentInterface";

export default function CreativeAgentPage() {
  return (
    <div className="flex flex-col w-full h-full min-h-screen bg-[#0A0A0A]">
      <CreativeAgentInterface />
    </div>
  );
}
