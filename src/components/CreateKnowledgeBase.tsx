"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Upload,
  CheckCircle,
  Loader,
  FileText,
  BookOpen,
  Database,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CreateKnowledgeBaseDialog() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const processingSteps = [
    { name: "Uploading files", icon: FileText },
    { name: "Processing documents", icon: BookOpen },
    { name: "Indexing content", icon: Database },
    { name: "Finalizing knowledge base", icon: CheckCircle },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
    }, 1500); // Each step takes 1.5 seconds in this simulation
  };

  const handleReset = () => {
    setIsProcessing(false);
    setCurrentStep(0);
    setProcessingComplete(false);
    setFiles([]);
    setFormData({ name: "", description: "" });
    setOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="h-12 w-full md:w-auto px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg flex items-center gap-2 border-none">
          <Plus className="h-5 w-5" />
          Create Knowledge Base
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl bg-[#0F0522] border border-purple-500/20 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-white flex items-center justify-between">
            {isProcessing
              ? processingComplete
                ? "Knowledge Base Created!"
                : "Processing Knowledge Base"
              : "Create Knowledge Base"}
            {!isProcessing && (
              <AlertDialogCancel className="h-8 w-8 p-0 rounded-full bg-white/5 hover:bg-white/10 border-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </AlertDialogCancel>
            )}
          </AlertDialogTitle>
          {!isProcessing && (
            <AlertDialogDescription className="text-gray-400">
              Create a new knowledge base by providing details and uploading
              relevant files.
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AnimatePresence mode="wait">
          {!isProcessing ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-5 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Knowledge Base Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter a name for your knowledge base"
                  className="bg-white/5 border-purple-500/20 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your knowledge base"
                  className="bg-white/5 border-purple-500/20 text-white placeholder:text-gray-500 focus-visible:ring-purple-500 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Attach Files</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-purple-500/20 border-dashed rounded-lg bg-white/5 transition-colors hover:bg-white/[0.07] cursor-pointer group">
                  <label className="w-full cursor-pointer">
                    <div className="space-y-2 text-center">
                      <Upload className="mx-auto h-10 w-10 text-purple-500 group-hover:text-purple-400 transition-colors" />
                      <div className="flex text-sm text-gray-400 justify-center">
                        <span className="relative font-medium text-purple-500 group-hover:text-purple-400 transition-colors">
                          Upload files
                        </span>
                        <Input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleFileChange}
                        />
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, UI files, images, and more
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {files.length > 0 && (
                <motion.div
                  className="bg-white/5 rounded-lg p-3 border border-purple-500/20"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <h4 className="text-sm font-medium text-white mb-2">
                    Attached Files ({files.length})
                  </h4>
                  <ul className="max-h-[150px] overflow-y-auto space-y-1 pr-1">
                    {files.map((file, index) => (
                      <motion.li
                        key={index}
                        className="py-2 px-3 text-sm text-gray-300 bg-white/5 rounded-md flex justify-between items-center group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <span className="truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <AlertDialogFooter className="gap-2 sm:gap-0">
                <AlertDialogCancel className="mt-0 bg-white/5 text-white hover:bg-white/10 border-purple-500/20">
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none"
                  disabled={files.length === 0 || !formData.name}
                >
                  Create Knowledge Base
                </Button>
              </AlertDialogFooter>
            </motion.form>
          ) : (
            <motion.div
              key="processing"
              className="space-y-6 py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="space-y-6">
                {processingSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isComplete = index < currentStep;
                  const isCurrent =
                    index === currentStep && !processingComplete;

                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div
                        className={`rounded-full p-2 ${
                          isComplete
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                            : isCurrent
                            ? "bg-purple-500/20"
                            : "bg-white/10"
                        }`}
                      >
                        {isCurrent ? (
                          <Loader className="h-5 w-5 text-purple-400 animate-spin" />
                        ) : (
                          <StepIcon
                            className={`h-5 w-5 ${
                              isComplete ? "text-white" : "text-gray-400"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
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
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        {isCurrent && (
                          <div className="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
                            <motion.div
                              className="bg-purple-500 h-1"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 1.5 }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {processingComplete && (
                <motion.div
                  className="mt-6 text-center space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="inline-flex items-center justify-center p-2 bg-green-500/10 rounded-full">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-green-400 font-medium">
                    Your knowledge base "{formData.name}" is ready to use!
                  </p>
                  <AlertDialogFooter className="flex-col space-y-2">
                    <AlertDialogAction
                      onClick={handleReset}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                      Go to Knowledge Base
                    </AlertDialogAction>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="w-full bg-white/5 text-white hover:bg-white/10 border-purple-500/20"
                    >
                      Create Another
                    </Button>
                  </AlertDialogFooter>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </AlertDialogContent>
    </AlertDialog>
  );
}
