import IdeaCard from "./IdeaCard";

// Mock data for ideas
const ideas = [
  {
    id: 1,
    title: "AI-powered personal stylist",
    description:
      "An app that uses AI to recommend outfits based on user preferences and current fashion trends.",
    tags: ["AI", "Fashion", "Mobile App"],
    category: "app-ideas",
    createdAt: new Date("2023-04-15"),
  },
  // Add more mock ideas here
];

interface IdeaListProps {
  category: string | null;
  searchQuery: string;
}

export default function IdeaList({ category, searchQuery }: IdeaListProps) {
  const filteredIdeas = ideas.filter((idea) => {
    const matchesCategory = category ? idea.category === category : true;
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {filteredIdeas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
}
