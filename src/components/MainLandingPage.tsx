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
  ChevronRight,
  Sparkles,
  Rocket,
  Zap,
  ArrowRight,
  Database,
  Bot,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { SignInDialog } from "@/components/ui/sign-in-dialog";
import { useState, useEffect } from "react";
import { SignUpDialog } from "@/components/ui/sign-up-dialog";
import { motion } from "framer-motion";

export function LandingPage() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignIn = () => {
    setIsSignInOpen(true);
  };

  const handleSignUp = () => {
    setIsSignUpOpen(true);
  };

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold flex items-center gap-2 group"
          >
            <span className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] bg-clip-text text-transparent">
              Creatigen
            </span>
            <Sparkles className="h-5 w-5 text-[#A78BFA] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-400 hover:text-[#A78BFA] transition-colors relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#A78BFA] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-gray-400 hover:text-[#A78BFA] transition-colors relative group"
            >
              How it Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#A78BFA] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-gray-400 hover:text-[#A78BFA] transition-colors relative group"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#A78BFA] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:text-[#A78BFA] hover:bg-black/20"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Button
              className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] hover:opacity-90 text-white font-medium shadow-lg shadow-[#6366F1]/20"
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <SignInDialog
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />

      <SignUpDialog
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />

      {/* Main Content */}
      <main className="pt-32 pb-16 px-4 relative">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-40 -left-64 w-96 h-96 bg-[#6366F1]/5 rounded-full blur-3xl"></div>
          <div className="absolute top-80 -right-64 w-96 h-96 bg-[#A78BFA]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-32 max-w-5xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
              Generate anything
              <br />
              what's in your{" "}
              <span className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] bg-clip-text text-transparent">
                mind
              </span>{" "}
              now.
            </h1>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
              Transform your creative ideas into reality with our AI-powered
              platform. Unleash your imagination without limits.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] hover:opacity-90 text-white font-medium px-8 py-6 rounded-xl shadow-lg shadow-[#6366F1]/20 flex items-center gap-2 mx-auto"
              onClick={handleSignUp}
            >
              Join the waitlist
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Features Grid */}
          <div id="features" className="max-w-6xl mx-auto pt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-center mb-4">
                Discover the Power of{" "}
                <span className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] bg-clip-text text-transparent">
                  Creatigen
                </span>
              </h2>
              <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                Our platform offers a suite of powerful tools to help you bring
                your creative ideas to life.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-[#121212] border border-[#1E1E1E] p-8 rounded-xl hover:border-[#A78BFA]/30 hover:shadow-lg hover:shadow-[#6366F1]/5 transition-all duration-300 h-full group">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-black to-[#1A1A1A] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <feature.icon className="w-7 h-7 text-[#A78BFA] group-hover:text-[#6366F1] transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-[#A78BFA] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        {/* How it Works Section */}
        <div id="how-it-works" className="max-w-6xl mx-auto pt-32 relative">
          {/* Background elements */}
          <div className="absolute -top-20 right-0 w-64 h-64 bg-[#C1FF00]/5 rounded-full blur-3xl opacity-60 z-0"></div>
          <div className="absolute bottom-20 left-0 w-80 h-80 bg-[#95d5b2]/5 rounded-full blur-3xl opacity-60 z-0"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <h2 className="text-5xl font-bold text-center mb-4">
              How{" "}
              <span className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] bg-clip-text text-transparent">
                Creatigen
              </span>{" "}
              Works
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto text-lg">
              Our intuitive platform makes it easy to bring your creative ideas
              to life in just a few simple steps.
            </p>
          </motion.div>

          <div className="relative container mx-auto">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#6366F1] to-[#A78BFA] opacity-20 hidden lg:block transform -translate-x-1/2 rounded-full z-0"></div>

            <div className="space-y-32 relative z-10 px-4 lg:px-16">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                >
                  <div
                    className={`flex flex-col ${
                      index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                    } items-center gap-8 lg:gap-24`}
                  >
                    {/* Step number and icon */}
                    <div className="relative flex-shrink-0">
                      <motion.div
                        className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#121212] to-[#1A1A1A] flex items-center justify-center shadow-xl relative z-10"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {step.icon && (
                          <step.icon className="w-16 h-16 text-[#A78BFA]" />
                        )}
                      </motion.div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#6366F1] to-[#A78BFA] rounded-2xl opacity-30 blur-sm -z-10"></div>
                      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-[#6366F1] to-[#A78BFA] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 ${
                        index % 2 === 0 ? "lg:text-left" : "lg:text-right"
                      }`}
                    >
                      <h3
                        className={`text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-center ${
                          index % 2 === 0 ? "lg:text-left" : "lg:text-right"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-gray-400 text-lg leading-relaxed mb-6 text-center ${
                          index % 2 === 0
                            ? "lg:text-left lg:pr-12"
                            : "lg:text-right lg:pl-12"
                        }`}
                      >
                        {step.description}
                      </p>

                      {/* Feature bullets */}
                      <ul
                        className={`space-y-3 mx-auto lg:mx-0 max-w-md w-full ${
                          index % 2 === 0 ? "lg:pr-12" : "lg:ml-auto lg:pl-12"
                        }`}
                      >
                        {step.features.map((feature, i) => (
                          <motion.li
                            key={i}
                            className={`flex items-center gap-2 text-gray-300 justify-center ${
                              index % 2 === 0
                                ? "lg:justify-start"
                                : "lg:justify-end lg:flex-row-reverse"
                            }`}
                            initial={{
                              opacity: 0,
                              x: index % 2 === 0 ? -10 : 10,
                            }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                          >
                            <Zap className="w-5 h-5 text-[#A78BFA] flex-shrink-0" />
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Arrow connector for mobile */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-8 lg:hidden">
                      <ArrowRight className="w-8 h-8 text-[#A78BFA] animate-pulse" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] hover:opacity-90 text-white font-medium px-8 py-6 rounded-xl shadow-lg shadow-[#6366F1]/20 flex items-center gap-2 mx-auto group"
              onClick={handleSignUp}
            >
              Start Creating Now
              <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Pricing Section Placeholder */}
        <div id="pricing" className="max-w-6xl mx-auto pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-center mb-4">
              Simple, Transparent{" "}
              <span className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
              Choose the plan that works best for your creative needs.
            </p>

            <div className="flex justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] hover:opacity-90 text-white font-medium px-8 py-6 rounded-xl shadow-lg shadow-[#6366F1]/20 flex items-center gap-2 mx-auto"
                onClick={handleSignUp}
              >
                Join the waitlist for early access
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-[#1E1E1E] mt-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <Link
                href="/"
                className="text-2xl font-bold flex items-center gap-2 mb-4"
              >
                <span className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] bg-clip-text text-transparent">
                  Creatigen
                </span>
              </Link>
              <p className="text-gray-500 text-sm max-w-xs">
                Transform your creative ideas into reality with our AI-powered
                platform.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#features"
                      className="text-sm text-gray-400 hover:text-[#A78BFA] transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#how-it-works"
                      className="text-sm text-gray-400 hover:text-[#A78BFA] transition-colors"
                    >
                      How it Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#pricing"
                      className="text-sm text-gray-400 hover:text-[#A78BFA] transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-400 hover:text-[#A78BFA] transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-400 hover:text-[#A78BFA] transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-gray-400 hover:text-[#A78BFA] transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1E1E1E] mt-12 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Creatigen. All rights reserved.
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
      "Create and manage your own creative repositories to store and organize your ideas in one centralized location.",
  },
  {
    icon: MessageSquare,
    title: "Chat with Repositories",
    description:
      "Engage in dynamic conversations with your repositories to explore and expand your ideas through natural language interactions.",
  },
  {
    icon: Lightbulb,
    title: "Creative Mentor Advice",
    description:
      "Receive tailored responses and advice from our AI-powered creative mentor to enhance your projects and overcome creative blocks.",
  },
  {
    icon: GitBranch,
    title: "Diagramming Feature",
    description:
      "Visualize your ideas with stunning diagrams! Create professional architectures and flowcharts with our powerful, drag-and-drop tools.",
  },
  {
    icon: Cpu,
    title: "Creative Engine",
    description:
      "Transform your ideas into reality with our cutting-edge Creative Engine - where imagination meets innovation through advanced AI processing.",
  },
  {
    icon: Brain,
    title: "Creative AI Mentor Agent",
    description:
      "Unlock your creative potential with our AI mentor - your personal guide to innovation, offering real-time insights and inspiration tailored to your needs.",
  },
];

const steps = [
  {
    title: "Create Your Repository",
    description:
      "Start by creating a repository for your creative project. This will be the central hub for all your ideas and content, organized in a way that enhances your creative workflow.",
    icon: Database,
    features: [
      "Unlimited storage for your creative assets",
      "Intelligent organization system",
      "Version history and tracking",
    ],
  },
  {
    title: "Interact with AI",
    description:
      "Use our AI-powered tools to expand your ideas, get feedback, and generate new content based on your creative direction. Our advanced AI understands your vision and helps bring it to life.",
    icon: Bot,
    features: [
      "Natural language conversation with AI",
      "Personalized creative suggestions",
      "Real-time feedback and improvements",
    ],
  },
  {
    title: "Bring Ideas to Life",
    description:
      "Transform your concepts into tangible outputs with our suite of creative tools. From text to visuals, code to design, our platform helps you create professional-quality results ready to share with the world.",
    icon: Rocket,
    features: [
      "One-click export in multiple formats",
      "Integration with popular platforms",
      "Collaboration tools for team projects",
    ],
  },
];
