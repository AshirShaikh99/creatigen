"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FolderPlus,
  MessageSquare,
  Lightbulb,
  GitBranch,
  Cpu,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LandingPage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/dashboard");
  };

  const handleSignUp = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1A1A1A]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Creatigen
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

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="border-[#C1FF00] text-[#C1FF00] hover:bg-[#C1FF00] hover:text-black"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Button
              className="bg-[#C1FF00] hover:bg-[#B1EF00] text-black font-medium"
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              Generate anything
              <br />
              what's in your mind now.
            </h1>
            <Button
              size="lg"
              className="bg-[#C1FF00] hover:bg-[#B1EF00] text-black font-medium px-8"
              onClick={handleSignUp}
            >
              Join the waitlist
            </Button>
          </div>

          {/* Features Grid */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">
              Discover the Power of Creatigen
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="bg-[#111111] border-[#1A1A1A] p-6 hover:bg-[#161616] transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-[#C1FF00]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[#1A1A1A]">
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
    title: "Create Engine",
    description:
      "Leverage our powerful Create Engine to bring your ideas to life with AI-assisted content generation.",
  },
  {
    icon: Brain,
    title: "Creative AI Mentor Agent",
    description:
      "Get personalized guidance and inspiration from our advanced AI mentor agent throughout your creative process.",
  },
];
