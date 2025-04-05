"use client";

import { useState, useMemo } from "react";
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Calendar,
  Search,
  ArrowUpDown,
  Clock,
  FileText,
  ChevronRight,
  Plus,
  Folder,
  FolderOpen,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Repository {
  id: string;
  name: string;
  description: string;
  dateCreated: string;
  documentCount: number;
  uuid?: string;
}

interface RepositoryListProps {
  repositories: Repository[];
  onSelectRepository: (id: string) => void;
}

type SortField = "name" | "dateCreated" | "documentCount";
type SortDirection = "asc" | "desc";

export const RepositoryList: React.FC<RepositoryListProps> = ({
  repositories,
  onSelectRepository,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("dateCreated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [hoveredRepo, setHoveredRepo] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedRepositories = useMemo(() => {
    // Filter repositories based on search query
    const filtered = repositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort repositories based on sort field and direction
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "dateCreated") {
        comparison =
          new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
      } else if (sortField === "documentCount") {
        comparison = a.documentCount - b.documentCount;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [repositories, searchQuery, sortField, sortDirection]);

  if (repositories.length === 0) {
    return (
      <div className="bg-[#121212] border border-[#1E1E1E] rounded-lg p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-4">
          <Folder className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">
          No repositories yet
        </h3>
        <p className="text-gray-400 mb-6">
          Create your first repository to get started
        </p>
        <Button
          className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] text-white hover:opacity-90"
          onClick={() => {}}
        >
          <Plus className="w-4 h-4 mr-2" /> Create Repository
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1A1A1A] border-[#2A2A2A] text-white w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`border-[#2A2A2A] ${
              sortField === "name" ? "bg-[#2A2A2A]" : "bg-[#1A1A1A]"
            } text-white hover:bg-[#2A2A2A]`}
            onClick={() => handleSort("name")}
          >
            Name{" "}
            {sortField === "name" && (
              <ArrowUpDown
                className={`ml-2 h-3 w-3 ${
                  sortDirection === "asc" ? "rotate-180" : ""
                }`}
              />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`border-[#2A2A2A] ${
              sortField === "dateCreated" ? "bg-[#2A2A2A]" : "bg-[#1A1A1A]"
            } text-white hover:bg-[#2A2A2A]`}
            onClick={() => handleSort("dateCreated")}
          >
            Date{" "}
            {sortField === "dateCreated" && (
              <ArrowUpDown
                className={`ml-2 h-3 w-3 ${
                  sortDirection === "asc" ? "rotate-180" : ""
                }`}
              />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`border-[#2A2A2A] ${
              sortField === "documentCount" ? "bg-[#2A2A2A]" : "bg-[#1A1A1A]"
            } text-white hover:bg-[#2A2A2A]`}
            onClick={() => handleSort("documentCount")}
          >
            Docs{" "}
            {sortField === "documentCount" && (
              <ArrowUpDown
                className={`ml-2 h-3 w-3 ${
                  sortDirection === "asc" ? "rotate-180" : ""
                }`}
              />
            )}
          </Button>
        </div>
      </div>

      {filteredAndSortedRepositories.length === 0 ? (
        <div className="bg-[#121212] border border-[#1E1E1E] rounded-lg p-6 text-center">
          <p className="text-gray-400">No repositories match your search</p>
        </div>
      ) : (
        <div className="bg-[#121212] border border-[#1E1E1E] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E1E1E]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Repository
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400 hidden md:table-cell">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400 hidden sm:table-cell">
                    Created
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Documents
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredAndSortedRepositories.map((repo, index) => (
                    <motion.tr
                      key={(repo.uuid || repo.id) + "-" + index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`border-b border-[#1E1E1E] hover:bg-[#1A1A1A] transition-colors ${
                        hoveredRepo === (repo.uuid || repo.id)
                          ? "bg-[#1A1A1A]"
                          : ""
                      }`}
                      onMouseEnter={() => setHoveredRepo(repo.uuid || repo.id)}
                      onMouseLeave={() => setHoveredRepo(null)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#A78BFA] flex items-center justify-center">
                            {hoveredRepo === (repo.uuid || repo.id) ? (
                              <FolderOpen className="w-5 h-5 text-white" />
                            ) : (
                              <Folder className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-white">
                              {repo.name}
                            </h3>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-400 hidden md:table-cell">
                        <div className="max-w-xs truncate">
                          {repo.description}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-400 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {repo.dateCreated}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          {repo.documentCount}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#A78BFA] hover:text-[#6366F1] hover:bg-[#A78BFA]/10"
                          onClick={() =>
                            onSelectRepository(repo.uuid || repo.id)
                          }
                        >
                          Open <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
