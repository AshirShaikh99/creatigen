import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  Sparkles,
  MessageSquare,
  GitBranch,
  FileText,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Brain,
    title: "Create Knowledge Base",
    description: "Start a new repository for your knowledge and ideas",
    href: "/create-knowledge-base", // Updated to match app directory routing
  },
  {
    icon: Sparkles,
    title: "Explore Repositories",
    description: "Browse and interact with your existing knowledge bases",
    href: "/?page=explore", // Updated to match URL parameter pattern
  },
  {
    icon: MessageSquare,
    title: "Chat with Knowledge Base",
    description: "Interact with your knowledge using natural language",
    href: "/?page=chat",
  },
  {
    icon: GitBranch,
    title: "Build Diagrams",
    description: "Visualize your ideas and concepts",
    href: "/?page=diagrams", // Updated to match URL parameter pattern
  },
  {
    icon: FileText,
    title: "View Documents",
    description: "Access and manage your attached files and documents",
    href: "/?page=documents", // Updated to match URL parameter pattern
  },
  {
    icon: HelpCircle,
    title: "Get Interactive Advice",
    description: "Receive personalized suggestions and insights",
    href: "/?page=advice", // Updated to match URL parameter pattern
  },
];

export function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0A0118]">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">
              Creatigen
            </span>
          </div>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Welcome to Your Knowledge Base
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="h-full transition-all duration-300 bg-white/5 border-purple-500/20 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-purple-500 mb-2" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/10 py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          © 2024 Creatigen. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
