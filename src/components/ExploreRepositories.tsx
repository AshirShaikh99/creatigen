"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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

export default function ExploreRepositories() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRepositories = mockRepositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-white">
        Explore Repositories
      </h2>
      <div className="mb-6 relative">
        <Input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      <div className="space-y-4">
        {filteredRepositories.map((repo) => (
          <div key={repo.id} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">
              {repo.name}
            </h3>
            <p className="text-gray-400 mb-4">{repo.description}</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                View
              </Button>
              <Button variant="outline" size="sm">
                Chat
              </Button>
              <Button variant="outline" size="sm">
                Get Advice
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
