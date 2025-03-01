"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Database, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Repository {
  id: string;
  uuid: string; // Add this field
  name: string;
  description: string;
  dateCreated: string;
  documentCount: number;
}

export const RepositoryList: React.FC<{
  repositories: Repository[];
  onSelectRepository: (id: string) => void;
}> = ({ repositories, onSelectRepository }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repositories.map((repo) => (
        <Card
          key={repo.uuid || repo.id} // Use uuid as primary key, fallback to id
          className="bg-[#111111] border-[#222222] p-6 hover:border-[#C1FF00]/50 transition-all duration-200 cursor-pointer"
          onClick={() => onSelectRepository(repo.id)}
        >
          {/* Rest of your card content */}
          <h3 className="text-lg font-semibold text-white mb-2">{repo.name}</h3>
          <p className="text-sm text-gray-400 mb-4">{repo.description}</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Created: {repo.dateCreated}</span>
            <span>{repo.documentCount} documents</span>
          </div>
        </Card>
      ))}
    </div>
  );
};
