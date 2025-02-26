"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import IdeaList from "./IdeaList";
import SearchBar from "./SearchBar";
import AddIdeaButton from "./AddIdeaButton";

export default function KnowledgeBaseDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen">
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <div className="flex-1 p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-400">
            Creatigen Knowledge Base
          </h1>
          <AddIdeaButton />
        </div>
        <SearchBar onSearch={setSearchQuery} />
        <IdeaList category={selectedCategory} searchQuery={searchQuery} />
      </div>
    </div>
  );
}
