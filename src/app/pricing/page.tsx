"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Basic",
    price: "$9",
    description: "Perfect for individuals just getting started",
    features: [
      "1 Creative Repository",
      "Basic AI Assistance",
      "Standard Templates",
      "Email Support",
      "7-day History"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "$29",
    description: "Ideal for professionals and small teams",
    features: [
      "10 Creative Repositories",
      "Advanced AI Assistance",
      "Premium Templates",
      "Priority Support",
      "30-day History",
      "Team Collaboration",
      "Custom Exports"
    ],
    cta: "Try Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with advanced needs",
    features: [
      "Unlimited Repositories",
      "Enterprise AI Features",
      "Custom Templates",
      "Dedicated Support",
      "Unlimited History",
      "Advanced Collaboration",
      "API Access",
      "Custom Integrations"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1E1E1E] bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <span className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] bg-clip-text text-transparent">
              Creatigen
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#features"
              className="text-sm font-medium text-gray-400 hover:text-[#A78BFA] transition-colors relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#A78BFA] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-gray-400 hover:text-[#A78BFA] transition-colors relative group"
            >
              How it Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#A78BFA] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-white hover:text-[#A78BFA] transition-colors relative group"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#A78BFA]"></span>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:text-[#A78BFA] hover:bg-black/20"
              asChild
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] hover:opacity-90 text-white font-medium shadow-lg shadow-[#6366F1]/20"
              asChild
            >
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Simple, Transparent{" "}
              <span className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Choose the plan that works best for your creative needs. All plans include core features to help you bring your ideas to life.
            </p>
            
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <span className="text-gray-400">Billed Monthly</span>
              <div className="w-12 h-6 bg-[#1E1E1E] rounded-full flex items-center p-1">
                <div className="w-4 h-4 bg-[#A78BFA] rounded-full ml-auto"></div>
              </div>
              <span className="text-white font-medium">Billed Annually</span>
              <span className="text-xs text-[#A78BFA] font-medium bg-[#A78BFA]/10 px-2 py-1 rounded-full">Save 20%</span>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] text-white text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`bg-[#121212] border ${plan.popular ? 'border-[#A78BFA]' : 'border-[#1E1E1E]'} rounded-xl p-8 h-full flex flex-col ${plan.popular ? 'shadow-lg shadow-[#A78BFA]/10' : ''}`}>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-gray-400 ml-1">/month</span>}
                  </div>
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                  
                  <Button
                    className={`mb-8 ${plan.popular 
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#A78BFA] text-white' 
                      : 'bg-[#1E1E1E] text-white hover:bg-[#2A2A2A]'}`}
                    size="lg"
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <div className="mt-auto">
                    <h4 className="font-medium text-sm text-gray-300 mb-4">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-5 h-5 text-[#A78BFA] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mt-32">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-[#121212] border border-[#1E1E1E] rounded-lg p-6"
                >
                  <h3 className="text-lg font-medium mb-3">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="max-w-4xl mx-auto mt-24 bg-gradient-to-r from-[#1E1E1E] to-[#121212] rounded-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
                <p className="text-gray-400 max-w-md">
                  Join thousands of creators who are already using Creatigen to bring their ideas to life.
                </p>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] hover:opacity-90 text-white font-medium px-8 py-6 rounded-xl shadow-lg shadow-[#6366F1]/20 whitespace-nowrap"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-[#1E1E1E] mt-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <Link href="/" className="text-2xl font-bold flex items-center gap-2 mb-4">
                <span className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] bg-clip-text text-transparent">
                  Creatigen
                </span>
              </Link>
              <p className="text-gray-500 text-sm max-w-xs">
                Transform your creative ideas into reality with our AI-powered platform.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/#features"
                      className="text-sm text-gray-400 hover:text-[#A78BFA] transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#how-it-works"
                      className="text-sm text-gray-400 hover:text-[#A78BFA] transition-colors"
                    >
                      How it Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pricing"
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

const faqs = [
  {
    question: "How does the 14-day free trial work?",
    answer: "You can try Creatigen Pro for free for 14 days. No credit card required. After your trial ends, you can choose to subscribe to one of our plans or continue with the Basic plan."
  },
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new features will be available immediately. If you downgrade, the changes will take effect at the end of your current billing cycle."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and Apple Pay. For Enterprise plans, we also offer invoice-based payment options."
  },
  {
    question: "Is there a discount for annual billing?",
    answer: "Yes, you save 20% when you choose annual billing compared to monthly billing."
  },
  {
    question: "What kind of support is included?",
    answer: "All plans include email support. Pro plans include priority support with faster response times. Enterprise plans include dedicated support with a named account manager."
  }
];
