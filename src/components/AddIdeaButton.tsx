import { Plus } from "lucide-react";

export default function AddIdeaButton() {
  return (
    <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors">
      <Plus size={18} className="mr-2" />
      Add New Idea
    </button>
  );
}
