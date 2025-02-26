"use client";

import { useState } from "react";
import { Sparkles, Edit, Trash } from "lucide-react";

interface Idea {
  id: number;
  title: string;
  description: string;
  tags: string[];
  category: string;
  createdAt: Date;
}

interface IdeaCardProps {
  idea: Idea;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-gray-800 rounded-lg p-6 transition-shadow hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-xl font-semibold mb-2 text-cyan-400">{idea.title}</h3>
      <p className="text-gray-300 mb-4">{idea.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {idea.tags.map((tag) => (
          <span
            key={tag}
            className="bg-purple-700 text-white text-xs px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>{idea.createdAt.toLocaleDateString()}</span>
        <div
          className={`flex gap-2 transition-opacity ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button className="hover:text-cyan-400" title="Enhance with AI">
            <Sparkles size={18} />
          </button>
          <button className="hover:text-yellow-400" title="Edit">
            <Edit size={18} />
          </button>
          <button className="hover:text-red-400" title="Delete">
            <Trash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
