import {
  FolderPlus,
  Search,
  MessageSquare,
  GitBranch,
  FileText,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Create Knowledge Base",
    description: "Start a new repository for your knowledge and ideas",
    icon: FolderPlus,
    color: "text-purple-500",
    href: "/create",
  },
  {
    title: "Explore Repositories",
    description: "Browse and interact with your existing knowledge bases",
    icon: Search,
    color: "text-cyan-500",
    href: "/explore",
  },
  {
    title: "Chat with Knowledge Base",
    description: "Interact with your knowledge using natural language",
    icon: MessageSquare,
    color: "text-green-500",
    href: "/chat",
  },
  {
    title: "Build Diagrams",
    description: "Visualize your ideas and concepts",
    icon: GitBranch,
    color: "text-orange-500",
    href: "/diagrams",
  },
  {
    title: "View Documents",
    description: "Access and manage your attached files and documents",
    icon: FileText,
    color: "text-pink-500",
    href: "/documents",
  },
  {
    title: "Get Interactive Advice",
    description: "Receive personalized suggestions and insights",
    icon: HelpCircle,
    color: "text-amber-500",
    href: "/advice",
  },
];

export function DashboardFeatures() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Welcome to Your Knowledge Base
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href} className="group">
            <Card className="h-full transition-all duration-300 bg-gray-900 border-gray-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10">
              <CardHeader>
                <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
