"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Database, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Repository {
  id: string;
  name: string;
  description: string;
  dateCreated: string;
  documentCount: number;
}

interface RepositoryListProps {
  repositories: Repository[];
  onSelectRepository: (id: string) => void;
}

export const RepositoryList: React.FC<RepositoryListProps> = ({
  repositories,
  onSelectRepository,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repositories.map((repo) => (
        <motion.div
          key={repo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className="bg-[#111111] border-[#222222] hover:border-[#C1FF00]/50 transition-colors cursor-pointer"
            onClick={() => onSelectRepository(repo.id)}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                {repo.name}
              </h3>
              <p className="text-gray-400 mb-4">{repo.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {repo.dateCreated}
                </div>
                <div className="flex items-center">
                  <Database className="w-4 h-4 mr-1" />
                  {repo.documentCount} docs
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
