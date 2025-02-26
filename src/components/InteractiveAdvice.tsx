"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb } from "lucide-react";

export default function InteractiveAdvice() {
  const [query, setQuery] = useState("");
  const [advice, setAdvice] = useState("");

  const handleGetAdvice = () => {
    // Here you would typically send the query to your AI backend
    // and then set the advice based on the response
    setAdvice(`Here's some advice based on "${query}": ...`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
        <Lightbulb className="mr-2 text-yellow-500" />
        Get Interactive Advice
      </h2>
      <div className="mb-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask for advice..."
          className="mb-2"
        />
        <Button onClick={handleGetAdvice} className="w-full">
          Get Advice
        </Button>
      </div>
      {advice && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-2">Advice:</h3>
          <p className="text-gray-400">{advice}</p>
        </div>
      )}
    </div>
  );
}
