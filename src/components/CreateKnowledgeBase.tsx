"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Upload,
  CheckCircle,
  Loader,
  FileText,
  Database,
  BookOpen,
} from "lucide-react";

export default function CreateKnowledgeBase() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [processingComplete, setProcessingComplete] = useState(false);

  const processingSteps = [
    { name: "Uploading files", icon: FileText },
    { name: "Processing documents", icon: BookOpen },
    { name: "Indexing content", icon: Database },
    { name: "Finalizing knowledge base", icon: CheckCircle },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate processing steps with delays
    let step = 0;
    const stepInterval = setInterval(() => {
      if (step < processingSteps.length) {
        setCurrentStep(step);
        step++;
      } else {
        clearInterval(stepInterval);
        setProcessingComplete(true);
      }
    }, 2000); // Each step takes 2 seconds in this simulation
  };

  const handleReset = () => {
    setIsProcessing(false);
    setCurrentStep(0);
    setProcessingComplete(false);
    setFiles([]);
  };

  return (
    <div className="min-h-screen bg-[#0A0118] p-8">
      <h2 className="text-3xl font-bold mb-8 text-white">
        Create Knowledge Base
      </h2>

      {!isProcessing ? (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div>
            <Label htmlFor="name" className="text-white">
              Knowledge Base Name
            </Label>
            <Input
              id="name"
              placeholder="Enter a name for your knowledge base"
              className="bg-white/5 border-purple-500/20 text-white placeholder:text-gray-400"
              required
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your knowledge base"
              className="bg-white/5 border-purple-500/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="file-upload" className="text-white">
              Attach Files
            </Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-purple-500/20 border-dashed rounded-md bg-white/5">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-purple-500" />
                <div className="flex text-sm text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-purple-500 hover:text-purple-400"
                  >
                    <span>Upload files</span>
                    <Input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-400">
                  PDF, UI files, images, and more
                </p>
              </div>
            </div>
          </div>
          {files.length > 0 && (
            <div className="bg-white/5 rounded-md p-4 border border-purple-500/20">
              <h4 className="text-sm font-medium text-white">
                Attached Files:
              </h4>
              <ul className="mt-2 divide-y divide-purple-500/10">
                {files.map((file, index) => (
                  <li key={index} className="py-2 text-sm text-gray-400">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            disabled={files.length === 0}
          >
            Create Knowledge Base
          </Button>
        </form>
      ) : (
        <div className="max-w-2xl space-y-8">
          <div className="bg-white/5 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-6">
              {processingComplete
                ? "Knowledge Base Created!"
                : "Processing Knowledge Base"}
            </h3>

            <div className="space-y-6">
              {processingSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isComplete = index < currentStep;
                const isCurrent = index === currentStep && !processingComplete;

                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div
                      className={`rounded-full p-2 ${
                        isComplete
                          ? "bg-purple-500"
                          : isCurrent
                          ? "bg-purple-500/20"
                          : "bg-white/10"
                      }`}
                    >
                      {isCurrent ? (
                        <Loader className="h-6 w-6 text-purple-500 animate-spin" />
                      ) : (
                        <StepIcon
                          className={`h-6 w-6 ${
                            isComplete ? "text-white" : "text-gray-400"
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isComplete
                            ? "text-purple-400"
                            : isCurrent
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {step.name}
                      </p>
                      {isComplete && (
                        <p className="text-xs text-purple-300">Complete</p>
                      )}
                      {isCurrent && (
                        <p className="text-xs text-gray-400">In progress...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {processingComplete && (
              <div className="mt-8">
                <p className="text-green-400 mb-4">
                  Your knowledge base is ready to use!
                </p>
                <Button
                  onClick={handleReset}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Create Another Knowledge Base
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
