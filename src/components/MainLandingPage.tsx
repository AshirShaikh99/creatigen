import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";
import { FloatingParticles } from "@/components/ui/floating-particles";
import {
  Brain,
  ArrowRight,
  Sparkles,
  Zap,
  MessageSquare,
  GitBranch,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function MainLandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0118]">
      <FloatingParticles />
      <GlowEffect />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link className="flex items-center gap-2" href="#">
            <Brain className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">
              Creatigen
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
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Sign In
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-400 to-purple-600 bg-clip-text text-transparent">
            One Knowledge Base For
            <br />
            All Your Creative Ideas
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            AI-powered knowledge management platform that helps you organize,
            connect, and enhance your creative ideas with advanced tools and
            insights.
          </p>
          <div className="flex gap-4 justify-center mb-16">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-purple-700">
              Watch Demo
            </Button>
          </div>
          <div className="relative mx-auto max-w-5xl">
            <div className="relative rounded-xl overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-500/10">
              <Image
                src="/placeholder.svg?height=600&width=1200"
                width={1200}
                height={600}
                alt="Creatigen Dashboard"
                className="w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Powerful Features for Creative Minds
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-white/5 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300"
              >
                <feature.icon className="h-10 w-10 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
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
                <div
                  key={index}
                  className="p-6 rounded-xl bg-white/5 border border-purple-500/20 backdrop-blur-sm"
                >
                  <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <integration.icon className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {integration.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {integration.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-radial from-purple-500/20 via-transparent to-transparent blur-3xl" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-900/50 to-purple-600/50 border border-purple-500/20 p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Transform Your Creative Process?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already using Creatigen to
              organize and enhance their ideas.
            </p>
            <Button
              size="lg"
              className="bg-white text-purple-900 hover:bg-gray-100"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="absolute inset-0 -z-10 bg-gradient-radial from-purple-500/20 via-transparent to-transparent blur-3xl" />
          </div>
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
              <Brain className="h-6 w-6 text-purple-500" />
              <span className="text-white font-semibold">Creatigen</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 Creatigen. All rights reserved.
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
  },
  {
    icon: Brain,
    title: "Knowledge Organization",
    description:
      "Organize your thoughts, documents, and research in a structured and searchable format.",
  },
  {
    icon: MessageSquare,
    title: "Interactive Chat",
    description:
      "Chat with your knowledge base using natural language to discover insights and connections.",
  },
  {
    icon: GitBranch,
    title: "Visual Diagrams",
    description:
      "Create and share beautiful diagrams to visualize your ideas and processes.",
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description:
      "Streamline your workflow with powerful shortcuts and automation tools.",
  },
  {
    icon: Brain,
    title: "Smart Search",
    description:
      "Find exactly what you need with context-aware search powered by AI.",
  },
];

const integrations = [
  {
    icon: Brain,
    title: "AI Assistant",
    description:
      "Get intelligent suggestions and insights from your knowledge base.",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Track changes and collaborate with team members seamlessly.",
  },
  {
    icon: MessageSquare,
    title: "Chat Interface",
    description: "Natural language interaction with your knowledge base.",
  },
];
