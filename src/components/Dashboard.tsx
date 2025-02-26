"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";
import { GlassCard } from "@/components/ui/glass-card";
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
  Plus,
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
      <GlowEffect />

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
                Dimension
              </span>
            </div>
          </div>

          {/* Project Info */}
          <div className="border-b border-purple-500/20 p-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-white">
                Dimension Project
              </h2>
              <p className="text-sm text-gray-400">Core Team</p>
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

          {/* Team Members */}
          <div className="border-t border-purple-500/20 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              Team Members
            </h3>
            <div className="space-y-2">
              {["Tejas", "Ari", "Landon"].map((member, index) => (
                <div key={member} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white text-xs font-medium">
                    {member.charAt(0)}
                  </div>
                  <span className="text-gray-300">{member}</span>
                </div>
              ))}
            </div>
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

          {/* Chat Section */}
          <GlassCard className="p-6">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white text-xs font-medium">
                  T
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">Tejas</span>
                    <span className="text-xs text-gray-500">1:14 PM</span>
                  </div>
                  <p className="text-gray-300 mt-1">
                    Hey Ari! I wanted to check in with you on the next release
                    and bug list.
                    <br />
                    Do you think we'll be on track to share the latest with the
                    team on Friday?
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white text-xs font-medium">
                  A
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">Ari</span>
                    <span className="text-xs text-gray-500">1:15 PM</span>
                  </div>
                  <p className="text-gray-300 mt-1">
                    There are a few items on the tasklist that needs to be
                    addressed on iOS.
                  </p>
                  <div className="mt-3 rounded-lg border border-purple-500/20 bg-black/20 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium text-white">
                          GitHub Pull Request
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">23 KB</span>
                    </div>
                    <div className="font-mono text-xs text-gray-400 bg-black/30 p-3 rounded-md">
                      <div>#!/bin/bash</div>
                      <div className="mt-2">
                        # Create a new directory for the website files
                      </div>
                      <div>mkdir my_website</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: Database,
                title: "Total Knowledge Bases",
                value: 3,
                color: "from-purple-500 to-indigo-600",
              },
              {
                icon: Activity,
                title: "Recent Activities",
                value: 24,
                color: "from-fuchsia-500 to-pink-600",
              },
              {
                icon: MessageSquare,
                title: "AI Interactions",
                value: 128,
                color: "from-blue-500 to-cyan-600",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <GlassCard className="relative overflow-hidden">
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
                </GlassCard>
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
                <GlassCard className="h-32 group">
                  <CreateKnowledgeBaseDialog>
                    <div className="flex flex-col items-center justify-center h-full gap-3 p-4 cursor-pointer">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Plus className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white font-medium text-center">
                        Create Knowledge Base
                      </span>
                    </div>
                  </CreateKnowledgeBaseDialog>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <GlassCard className="h-32 group" glowColor="pink">
                  <Link href="/?page=chat" className="block h-full">
                    <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-fuchsia-600 to-pink-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white font-medium text-center">
                        Start AI Conversation
                      </span>
                    </div>
                  </Link>
                </GlassCard>
              </motion.div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-purple-500 to-fuchsia-500 rounded-full"></span>
              Tasks
            </h2>
            <GlassCard>
              <div className="p-4 space-y-2">
                {[
                  { title: "iOS-211 - Selector fix", completed: false },
                  { title: "Discord auth", completed: false },
                ].map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div
                      className={`h-5 w-5 rounded border ${
                        task.completed
                          ? "bg-purple-500 border-purple-600"
                          : "border-gray-600"
                      } flex items-center justify-center`}
                    >
                      {task.completed && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        task.completed
                          ? "text-gray-500 line-through"
                          : "text-gray-300"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </motion.main>
    </div>
  );
}

// This component is needed for the Check icon in the tasks section
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
