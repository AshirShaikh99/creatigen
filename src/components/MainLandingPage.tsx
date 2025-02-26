"use client";

import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Brain,
  ArrowRight,
  Sparkles,
  Zap,
  MessageSquare,
  GitBranch,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MainLandingPageProps {
  onSignIn: () => void;
}

export function MainLandingPage({ onSignIn }: MainLandingPageProps) {
  const handleSignIn = () => {
    onSignIn();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0500]">
      <FloatingParticles />
      <GlowEffect />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link className="flex items-center gap-2" href="#">
            <Brain className="h-8 w-8 text-amber-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-amber-500 bg-clip-text text-transparent">
              Dimension
            </span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link
              className="text-sm text-gray-400 hover:text-white transition-colors"
              href="#"
            >
              Features
            </Link>
            <Link
              className="text-sm text-gray-400 hover:text-white transition-colors"
              href="#"
            >
              Documentation
            </Link>
            <Link
              className="text-sm text-gray-400 hover:text-white transition-colors"
              href="#"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700"
              onClick={handleSignIn}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-amber-400 to-amber-600 bg-clip-text text-transparent">
            The delightfully smart
            <br />
            collaboration platform.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Connect your team, tools, and knowledge in one unified workspace
            powered by AI.
          </p>
          <div className="flex gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-amber-800 hover:opacity-90 border border-amber-500/20"
            >
              Join waitlist
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="relative mx-auto max-w-5xl">
            <GlassCard className="overflow-hidden">
              <div className="relative">
                <Image
                  src=""
                  width={1200}
                  height={600}
                  alt="Dimension Dashboard"
                  className="w-full rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Powerful Features for Creative Teams
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <GlassCard
                key={feature.title}
                className="p-6 hover:border-amber-500/40 transition-all duration-300"
                glowColor={feature.glowColor}
              >
                <feature.icon className="h-10 w-10 text-amber-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">
            Seamless AI Integration
          </h2>
          <div className="relative mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {integrations.map((integration, index) => (
                <GlassCard
                  key={index}
                  className="p-6"
                  glowColor={integration.glowColor}
                >
                  <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <integration.icon className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {integration.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {integration.description}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 text-center">
          <GlassCard className="p-12" glowColor="amber">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Transform Your Collaboration?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of teams who are already using Dimension to
              organize and enhance their workflow.
            </p>
            <Button
              size="lg"
              className="bg-white text-amber-900 hover:bg-gray-100"
              onClick={handleSignIn}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-amber-500" />
              <span className="text-white font-semibold">Dimension</span>
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Dimension. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description:
      "Get intelligent suggestions and connections between your ideas using advanced AI algorithms.",
    glowColor: "amber",
  },
  {
    icon: Brain,
    title: "Knowledge Organization",
    description:
      "Organize your thoughts, documents, and research in a structured and searchable format.",
    glowColor: "gold",
  },
  {
    icon: MessageSquare,
    title: "Interactive Chat",
    description:
      "Chat with your knowledge base using natural language to discover insights and connections.",
    glowColor: "brown",
  },
  {
    icon: GitBranch,
    title: "Visual Diagrams",
    description:
      "Create and share beautiful diagrams to visualize your ideas and processes.",
    glowColor: "amber",
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description:
      "Streamline your workflow with powerful shortcuts and automation tools.",
    glowColor: "gold",
  },
  {
    icon: Brain,
    title: "Smart Search",
    description:
      "Find exactly what you need with context-aware search powered by AI.",
    glowColor: "brown",
  },
];

const integrations = [
  {
    icon: Brain,
    title: "AI Assistant",
    description:
      "Get intelligent suggestions and insights from your knowledge base.",
    glowColor: "amber",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Track changes and collaborate with team members seamlessly.",
    glowColor: "gold",
  },
  {
    icon: MessageSquare,
    title: "Chat Interface",
    description: "Natural language interaction with your knowledge base.",
    glowColor: "brown",
  },
];
