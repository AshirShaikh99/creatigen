"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { GridBackground } from "./ui/grid-background";
import {
  FolderPlus,
  MessageSquare,
  Lightbulb,
  GitBranch,
  Cpu,
  Brain,
} from "lucide-react";

export function MainLandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <GridBackground />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Creatigen</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </nav>

          <Button className="bg-[#C1FF00] hover:bg-[#B1EF00] text-black font-medium">
            Join the waitlist
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Generate anything
            <br />
            what's in your mind now.
          </h1>
          <Button
            size="lg"
            className="bg-[#C1FF00] hover:bg-[#B1EF00] text-black font-medium px-8"
          >
            Join the waitlist
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Discover the Power of Creatigen
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C1FF00]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#C1FF00]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Ready to start creating?
            </h2>
            <p className="text-gray-400 mb-8">
              Join thousands of creators who are already using Creatigen to
              bring their ideas to life.
            </p>
            <Button
              size="lg"
              className="bg-[#C1FF00] hover:bg-[#B1EF00] text-black font-medium px-8"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-semibold">Creatigen</span>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: FolderPlus,
    title: "Creative Repository",
    description:
      "Create and manage your own creative repositories to store and organize your ideas.",
  },
  {
    icon: MessageSquare,
    title: "Chat with Repositories",
    description:
      "Engage in dynamic conversations with your repositories to explore and expand your ideas.",
  },
  {
    icon: Lightbulb,
    title: "Creative Mentor Advice",
    description:
      "Receive tailored responses and advice from our AI-powered creative mentor to enhance your projects.",
  },
  {
    icon: GitBranch,
    title: "Diagramming Feature",
    description:
      "Create architectures and diagrams on the go with our intuitive diagramming tools.",
  },
  {
    icon: Cpu,
    title: "Creative Engine",
    description:
      "Leverage our powerful Creative Engine to bring your ideas to life with AI-assisted content generation.",
  },
  {
    icon: Brain,
    title: "Creative AI Mentor Agent",
    description:
      "Get personalized guidance and inspiration from our advanced AI mentor agent throughout your creative process.",
  },
];
