"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for repositories
const mockRepositories = [
  {
    id: 1,
    name: "Project Ideas",
    description: "Collection of innovative project ideas",
  },
  {
    id: 2,
    name: "Research Papers",
    description: "Academic research and papers",
  },
  {
    id: 3,
    name: "Design Inspirations",
    description: "UI/UX design concepts and inspirations",
  },
  // Add more mock repositories as needed
];

export function ExploreRepositoriesDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const filteredRepositories = mockRepositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl bg-[#0F0522] border border-purple-500/20 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-white">
            Explore Repositories
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Browse and search through your knowledge bases
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-4 space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-purple-500/20 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <AnimatePresence>
            {filteredRepositories.map((repo) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white/5 p-4 rounded-lg border border-purple-500/20"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {repo.name}
                </h3>
                <p className="text-gray-400 mb-4">{repo.description}</p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 border-purple-500/20"
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 border-purple-500/20"
                  >
                    Chat
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 border-purple-500/20"
                  >
                    Get Advice
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
