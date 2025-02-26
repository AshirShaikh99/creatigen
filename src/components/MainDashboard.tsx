import {
  FolderPlus,
  Search,
  MessageSquare,
  GitBranch,
  FileText,
  HelpCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const features = [
  {
    title: "Create Knowledge Base",
    description: "Start a new repository for your knowledge and ideas",
    icon: FolderPlus,
    color: "bg-purple-500",
    href: "/create-knowledge-base",
  },
  {
    title: "Explore Repositories",
    description: "Browse and interact with your existing knowledge bases",
    icon: Search,
    color: "bg-cyan-500",
    href: "/explore",
  },
  {
    title: "Chat with Knowledge Base",
    description: "Interact with your knowledge using natural language",
    icon: MessageSquare,
    color: "bg-green-500",
    href: "/chat",
  },
  {
    title: "Build Diagrams",
    description: "Visualize your ideas and concepts",
    icon: GitBranch,
    color: "bg-orange-500",
    href: "/diagrams",
  },
  {
    title: "View Documents",
    description: "Access and manage your attached files and documents",
    icon: FileText,
    color: "bg-pink-500",
    href: "/documents",
  },
  {
    title: "Get Interactive Advice",
    description: "Receive personalized suggestions and insights",
    icon: HelpCircle,
    color: "bg-amber-500",
    href: "/advice",
  },
];

export default function MainDashboard() {
  return (
    <div className="min-h-screen bg-black px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-16">
          <span className="text-white">Creatigen</span>{" "}
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Knowledge Base
          </span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="group relative overflow-hidden bg-[#1A1D24] border-0 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
                <div
                  className={`${feature.color} rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h2>
                <p className="text-gray-400 text-sm">{feature.description}</p>
                <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
