"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Brain,
  MessageSquare,
  GitBranch,
  HelpCircle,
  Database,
  Activity,
  ChevronRight,
  Menu,
  X,
  Plus,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";
import ChatInterface from "@/components/ChatInterface";
import DiagramChatInterface from "@/components/DiagramChatInterface";
import { CreateKnowledgebaseModal } from "@/components/CreateKnowledgeBase";
import { RepositoryList } from "@/components/ExploreRepositories";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/lib/store";
import ChatPopup from "@/components/chat-popup";
import { cn } from "@/lib/utils";
import { UserButton, SignedIn } from "@clerk/nextjs";

const features = [
  {
    icon: Home,
    title: "Dashboard",
    description: "Overview of your workspace",
    href: "/dashboard",
    isActive: true,
  },
  {
    icon: Brain,
    title: "Create Repository",
    description: "Start a new repository",
    href: "/create-knowledge-base",
  },
  {
    icon: GitBranch,
    title: "Build Diagrams",
    description: "Visualize concepts",
    href: "/diagrams",
  },
  {
    icon: HelpCircle,
    title: "Creative Agent",
    description: "Get insights",
    href: "/creative-agent",
  },
  {
    icon: MessageSquare,
    title: "Creative Chat",
    description: "Chat with AI assistant",
    href: "/creative-chat",
  },
];

export function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showDiagramChat, setShowDiagramChat] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRepository, setSelectedRepository] = useState<string | null>(
    null
  );
  const [selectedRepositoryPopup, setSelectedRepositoryPopup] = useState<
    string | null
  >(null);
  const repositories = useSelector(
    (state: RootState) => state.knowledgebase.repositories
  );

  const handleSelectRepository = (id: string) => {
    setSelectedRepositoryPopup(id);
    setSelectedRepository(id);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-black">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-[#C1FF00]/20 text-[#C1FF00] hover:bg-[#95d5b2]/30 transition-all duration-300"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0A0A0A] border-r border-[#1A1A1A] transform lg:translate-x-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="border-b border-[#1A1A1A] p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#d8f3dc] to-[#83c5be] flex items-center justify-center">
                <Brain className="h-6 w-6 text-black" />
              </div>
              <span className="text-xl font-bold text-white">Creatigen</span>
            </div>
          </div>

          {/* Menu */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav>
              <ul className="space-y-1">
                {features.map((feature, index) => (
                  <motion.li
                    key={`feature-${feature.title}-${index}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer",
                        feature.isActive ||
                          (feature.title === "Build Diagrams" &&
                            showDiagramChat)
                          ? "bg-[#C1FF00]/15 text-white"
                          : "text-gray-400 hover:text-white hover:bg-[#95d5b2]/10"
                      )}
                      onClick={() => {
                        if (feature.title === "Build Diagrams") {
                          setShowDiagramChat(true);
                          setShowChat(false);
                        } else if (feature.title === "Create Repository") {
                          setIsCreateModalOpen(true);
                        } else if (feature.title === "Dashboard") {
                          setShowChat(false);
                          setShowDiagramChat(false);
                        } else if (feature.title === "Creative Agent") {
                          window.location.href = "/creative-agent";
                        } else if (feature.title === "Creative Chat") {
                          window.location.href = "/creative-chat";
                        }
                        // Close sidebar on mobile after selection
                        if (window.innerWidth < 1024) {
                          setIsSidebarOpen(false);
                        }
                      }}
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200",
                          feature.isActive ||
                            (feature.title === "Build Diagrams" &&
                              showDiagramChat)
                            ? "bg-[#d8f3dc] text-black"
                            : "bg-[#1A1A1A] text-[#d8f3dc] group-hover:bg-[#95d5b2]/20"
                        )}
                      >
                        <feature.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{feature.title}</span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 ml-auto transition-opacity",
                          feature.isActive ||
                            (feature.title === "Build Diagrams" &&
                              showDiagramChat)
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        )}
                      />
                    </div>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Footer with UserButton */}
          <div className="border-t border-[#1A1A1A] p-4 space-y-3">
            <SignedIn>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Account</span>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-9 h-9",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </motion.aside>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <motion.main
        className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {!showChat && !showDiagramChat ? (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome to Your{" "}
                <span className="bg-gradient-to-r from-[#d8f3dc] to-[#83c5be] bg-clip-text text-transparent">
                  Creative Space
                </span>
              </h1>
              <p className="text-gray-400">
                Creativity with Creatigen. Organize, explore, and bring your
                innovative ideas to life
              </p>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  icon: Database,
                  title: "Total Repositories",
                  value: repositories.length,
                  color: "from-[#d8f3dc] to-[#83c5be]",
                  id: "total-repos",
                },
                {
                  icon: Activity,
                  title: "Recent Activities",
                  value: 24,
                  color: "from-[#d8f3dc] to-[#83c5be]",
                  id: "recent-activities",
                },
                {
                  icon: MessageSquare,
                  title: "AI Interactions",
                  value: 128,
                  color: "from-[#d8f3dc] to-[#83c5be]",
                  id: "ai-interactions",
                },
              ].map((stat, index) => (
                <motion.div
                  key={`stat-${stat.id}-${index}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="relative overflow-hidden bg-[#0A0A0A] border-[#1A1A1A] shadow-lg">
                    <div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${stat.color})`,
                      }}
                    ></div>
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-12 w-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                        >
                          <stat.icon className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">{stat.title}</p>
                          <h3 className="text-3xl font-bold text-white">
                            {stat.value}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="h-8 w-1 bg-gradient-to-b from-[#d8f3dc] to-[#83c5be] rounded-full"></span>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Card className="h-32 group bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#95d5b2]/30 shadow-lg transition-all duration-300">
                    <div
                      className="flex flex-col items-center justify-center h-full gap-3 p-4 cursor-pointer"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#d8f3dc] to-[#83c5be] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Plus className="h-6 w-6 text-black" />
                      </div>
                      <span className="text-white font-medium text-center">
                        Create Creative Repository
                      </span>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Card className="h-32 group bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#95d5b2]/30 shadow-lg transition-all duration-300">
                    <div
                      className="flex flex-col items-center justify-center h-full gap-3 p-4 cursor-pointer"
                      onClick={() => setShowChat(true)}
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#d8f3dc] to-[#83c5be] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Brain className="h-6 w-6 text-black" />
                      </div>
                      <span className="text-white font-medium text-center">
                        Start AI Conversation
                      </span>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Card className="h-32 group bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#95d5b2]/30 shadow-lg transition-all duration-300">
                    <div
                      className="flex flex-col items-center justify-center h-full gap-3 p-4 cursor-pointer"
                      onClick={() => setShowDiagramChat(true)}
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#d8f3dc] to-[#83c5be] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <GitBranch className="h-6 w-6 text-black" />
                      </div>
                      <span className="text-white font-medium text-center">
                        Build Diagrams
                      </span>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Repository List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="h-8 w-1 bg-gradient-to-b from-[#d8f3dc] to-[#83c5be] rounded-full"></span>
                Chat With Creative Space
              </h2>
              <RepositoryList
                repositories={repositories}
                onSelectRepository={handleSelectRepository}
              />
            </div>
          </div>
        ) : showDiagramChat ? (
          <DiagramChatInterface
            onBackToDashboard={() => setShowDiagramChat(false)}
          />
        ) : (
          <ChatInterface
            onBackToDashboard={() => setShowChat(false)}
            selectedRepository={selectedRepository}
          />
        )}
        {selectedRepositoryPopup && (
          <ChatPopup
            onClose={() => setSelectedRepositoryPopup(null)}
            title={
              repositories.find((repo) => repo.uuid === selectedRepositoryPopup)
                ?.name || "Repository Chat"
            }
          />
        )}
      </motion.main>

      <CreateKnowledgebaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

export default Dashboard;
