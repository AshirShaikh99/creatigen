"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Sparkles,
  MessageSquare,
  GitBranch,
  FileText,
  HelpCircle,
  Database,
  Activity,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreateKnowledgeBaseDialog } from "@/components/CreateKnowledgeBase";
import { ExploreRepositoriesDialog } from "@/components/ExploreRepositories";

const features = [
  {
    icon: Brain,
    title: "Create Knowledge Base",
    description: "Start a new repository",
    component: CreateKnowledgeBaseDialog,
  },
  {
    icon: Sparkles,
    title: "Explore Repositories",
    description: "Browse knowledge bases",
    component: ExploreRepositoriesDialog,
  },
  {
    icon: MessageSquare,
    title: "Chat with Knowledge Base",
    description: "Interact with AI",
    href: "/?page=chat",
  },
  {
    icon: GitBranch,
    title: "Build Diagrams",
    description: "Visualize concepts",
    href: "/?page=diagrams",
  },
  {
    icon: FileText,
    title: "View Documents",
    description: "Manage files",
    href: "/?page=documents",
  },
  {
    icon: HelpCircle,
    title: "Get Interactive Advice",
    description: "Get insights",
    href: "/?page=advice",
  },
];

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0A0118] to-[#1A0B30]">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-all duration-300"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0F0522] border-r border-purple-500/20 transform lg:translate-x-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="border-b border-purple-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
                Creatigen
              </span>
            </div>
          </div>

          {/* Menu */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <motion.li
                  key={feature.title}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {feature.component ? (
                    <feature.component>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/10 transition-all duration-200 group cursor-pointer">
                        <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition-all duration-200">
                          <feature.icon className="h-4 w-4" />
                        </div>
                        <span>{feature.title}</span>
                        <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </feature.component>
                  ) : (
                    <Link href={feature.href || "#"}>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/10 transition-all duration-200 group">
                        <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition-all duration-200">
                          <feature.icon className="h-4 w-4" />
                        </div>
                        <span>{feature.title}</span>
                        <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="border-t border-purple-500/20 p-4">
            <Button
              variant="ghost"
              className="w-full text-gray-400 hover:text-white hover:bg-purple-500/10 justify-start gap-3"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <motion.main
        className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome to Your{" "}
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
                Knowledge Base
              </span>
            </h1>
            <p className="text-gray-400">
              Organize, explore, and interact with your data using AI
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: Database,
                title: "Total Knowledge Bases",
                value: 0,
                color: "from-purple-500 to-indigo-600",
              },
              {
                icon: Activity,
                title: "Recent Activities",
                value: 0,
                color: "from-fuchsia-500 to-pink-600",
              },
              {
                icon: MessageSquare,
                title: "AI Interactions",
                value: 0,
                color: "from-blue-500 to-cyan-600",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                className="relative overflow-hidden rounded-xl border border-purple-500/20 bg-white/[0.02] backdrop-blur-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${
                      stat.color.split(" ")[1]
                    }, ${stat.color.split(" ")[3]})`,
                  }}
                ></div>
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-white">
                        {stat.value}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 opacity-10">
                  <stat.icon className="h-24 w-24 text-white" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-purple-500 to-fuchsia-500 rounded-full"></span>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="relative h-32 rounded-xl overflow-hidden border border-purple-500/20 bg-white/[0.02] backdrop-blur-sm group flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-indigo-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-700 opacity-80"></div>
                  <CreateKnowledgeBaseDialog />
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <Link href="/?page=chat">
                  <div className="relative h-32 rounded-xl overflow-hidden border border-purple-500/20 bg-white/[0.02] backdrop-blur-sm group">
                    <div
                      className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, fuchsia-600, pink-700)`,
                      }}
                    ></div>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-600 to-pink-700 opacity-80"></div>
                    <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-fuchsia-600 to-pink-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white font-medium text-center">
                        Start AI Conversation
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Getting Started Guide */}
          <motion.div
            className="rounded-xl border border-purple-500/20 bg-white/[0.02] backdrop-blur-sm overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="h-8 w-1 bg-gradient-to-b from-purple-500 to-fuchsia-500 rounded-full"></span>
                Getting Started
              </h2>
              <div className="space-y-6">
                {[
                  'Create your first knowledge base by clicking the "Create Knowledge Base" button',
                  "Upload your documents and data to build your knowledge repository",
                  "Start interacting with your knowledge base using AI-powered chat",
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white font-medium shadow-lg">
                        {index + 1}
                      </div>
                      {index < 2 && (
                        <div className="absolute top-10 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-purple-500 to-transparent -translate-x-1/2 h-12"></div>
                      )}
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 flex-1 border border-purple-500/10">
                      <p className="text-gray-300">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
