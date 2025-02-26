const categories = [
  { id: "app-ideas", name: "App Ideas" },
  { id: "marketing", name: "Marketing" },
  { id: "ux-design", name: "UX Design" },
  // Add more categories as needed
];

interface SidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function Sidebar({
  selectedCategory,
  onSelectCategory,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-800 p-6 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-cyan-400">Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id} className="mb-2">
            <button
              onClick={() => onSelectCategory(category.id)}
              className={`w-full text-left p-2 rounded transition-colors ${
                selectedCategory === category.id
                  ? "bg-cyan-700 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
