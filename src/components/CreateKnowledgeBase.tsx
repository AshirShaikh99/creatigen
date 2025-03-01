"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  CheckCircle2,
  FileText,
  Database,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addKnowledgebase } from "@/app/lib/knowledgebase/knowledgebaseSlice";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";

interface CreateKnowledgebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateKnowledgebaseResponse {
  id: number;
  uuid: string;
  title: string;
  description: string;
  status: string;
  collection_name: string;
  document_count: number;
  created_at: string;
  updated_at: string;
}

const createKnowledgeBase = async (
  formData: FormData
): Promise<CreateKnowledgebaseResponse> => {
  const response = await axios.post(
    "http://localhost:8000/api/knowledge-base/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const CreateKnowledgebaseModal: React.FC<
  CreateKnowledgebaseModalProps
> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Auto-advance through steps for demo purposes
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentStep > 0 && currentStep < 4) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, [currentStep]);

  // Simulate progress bar animation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentStep > 0 && currentStep < 4) {
      interval = setInterval(() => {
        setProcessingProgress((prev) => {
          const nextTarget = (currentStep - 1) * 33.33 + 33.33;
          const increment = (nextTarget - prev) * 0.1;
          return Math.min(prev + increment, nextTarget);
        });
      }, 50);
    } else if (currentStep === 4) {
      setProcessingProgress(100);
    }

    return () => clearInterval(interval);
  }, [currentStep]);

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: createKnowledgeBase,
    onSuccess: (response) => {
      const knowledgebase = {
        id: response.uuid,
        name: response.title,
        description: response.description,
        dateCreated: response.created_at,
        documentCount: response.document_count,
        collection_name: response.collection_name,
        uuid: response.uuid,
        status: response.status,
        created_at: response.created_at,
        updated_at: response.updated_at,
      };

      // Start the animation sequence
      setCurrentStep(1);

      // Show success message and close after animation completes
      setTimeout(() => {
        toast.success("Knowledge base created successfully!");
        dispatch(addKnowledgebase(knowledgebase));
        handleReset();
        onClose();
      }, 6000);
    },
    onError: (error) => {
      toast.error("Failed to create knowledge base. Please try again.");
      console.error("Error creating knowledge base:", error);
      setCurrentStep(0);
    },
  });

  const handleReset = () => {
    setName("");
    setDescription("");
    setFiles([]);
    setCurrentStep(0);
    setProcessingProgress(0);
  };

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Please enter a knowledge base name");
      return;
    }

    if (!files.length) {
      toast.error("Please upload at least one document");
      return;
    }

    const formData = new FormData();
    formData.append("uuid", uuidv4());
    formData.append("title", name);
    formData.append("description", description);
    files.forEach((file) => formData.append("document", file));

    mutate(formData);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Animation variants for the modal
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Animation variants for the progress steps
  const stepVariants = {
    inactive: { scale: 0.8, opacity: 0.5 },
    active: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    completed: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const getStepStatus = (step: number) => {
    if (currentStep > step) return "completed";
    if (currentStep === step) return "active";
    return "inactive";
  };

  const renderFormContent = () => (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="kb-name"
          className="block text-sm font-medium text-gray-200 mb-1"
        >
          Knowledge Base Name
        </label>
        <Input
          id="kb-name"
          placeholder="Enter a name for your knowledge base"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[#0A0A0A] border-[#1A1A1A] focus:border-[#C1FF00]/50 focus:ring-[#C1FF00]/20"
        />
      </div>

      <div>
        <label
          htmlFor="kb-description"
          className="block text-sm font-medium text-gray-200 mb-1"
        >
          Description (Optional)
        </label>
        <Textarea
          id="kb-description"
          placeholder="Add a description for your knowledge base"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-[#0A0A0A] border-[#1A1A1A] focus:border-[#C1FF00]/50 focus:ring-[#C1FF00]/20 min-h-[80px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Upload Documents
        </label>
        <div
          className={cn(
            "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200",
            dragActive
              ? "border-[#C1FF00] bg-[#C1FF00]/10"
              : "border-[#1A1A1A] bg-[#0A0A0A] hover:bg-[#111111] hover:border-[#333333]"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload
                className={cn(
                  "w-8 h-8 mb-2 transition-colors duration-200",
                  dragActive ? "text-[#C1FF00]" : "text-gray-400"
                )}
              />
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, DOC, DOCX, TXT (MAX. 10MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setFiles(Array.from(e.target.files));
                }
              }}
              accept=".pdf,.doc,.docx,.txt"
            />
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-3 p-3 bg-[#111111] rounded-lg border border-[#1A1A1A]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-300">
                Selected files
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-gray-400 hover:text-white"
                onClick={() => setFiles([])}
              >
                Clear all
              </Button>
            </div>
            <ul className="space-y-1">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center text-xs text-gray-400"
                >
                  <FileText className="h-3 w-3 mr-2 text-[#C1FF00]" />
                  <span className="truncate">{file.name}</span>
                  <span className="ml-auto text-gray-500">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Button
        onClick={handleCreate}
        className="w-full bg-gradient-to-r from-[#C1FF00] to-[#83c5be] text-black hover:from-[#d2ff4d] hover:to-[#9ddbd5] transition-all duration-300"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Create Knowledge Base"
        )}
      </Button>
    </div>
  );

  const renderLoadingContent = () => (
    <div className="py-6 px-2">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Processing</span>
          <span>{Math.round(processingProgress)}%</span>
        </div>
        <div className="relative h-2 bg-[#111111] rounded-full overflow-hidden">
          <motion.div
            className="absolute h-full bg-gradient-to-r from-[#C1FF00] to-[#83c5be] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${processingProgress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Processing steps */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { step: 1, icon: Upload, label: "Uploading" },
          { step: 2, icon: FileText, label: "Processing" },
          { step: 3, icon: Database, label: "Creating" },
          { step: 4, icon: CheckCircle2, label: "Complete" },
        ].map(({ step, icon: Icon, label }) => (
          <motion.div
            key={step}
            className="flex flex-col items-center"
            initial="inactive"
            animate={getStepStatus(step)}
            variants={stepVariants}
          >
            <div className="relative mb-2">
              {currentStep > step ? (
                <div className="h-10 w-10 rounded-full bg-[#C1FF00] flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-black" />
                </div>
              ) : (
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center",
                    currentStep === step
                      ? "bg-[#111111] border-2 border-[#C1FF00]"
                      : "bg-[#111111] border border-[#333333]"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      currentStep === step ? "text-[#C1FF00]" : "text-gray-500"
                    )}
                  />

                  {currentStep === step && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#C1FF00] border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                  )}
                </div>
              )}
            </div>
            <span
              className={cn(
                "text-xs text-center",
                currentStep > step
                  ? "text-[#C1FF00]"
                  : currentStep === step
                  ? "text-white"
                  : "text-gray-500"
              )}
            >
              {label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Status message */}
      <div className="text-center">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mb-2"
        >
          <h3 className="text-lg font-medium text-white">
            {currentStep === 1 && "Uploading your documents..."}
            {currentStep === 2 && "Processing document content..."}
            {currentStep === 3 && "Creating your knowledge base..."}
            {currentStep === 4 && (
              <span className="text-[#C1FF00]">
                Knowledge base created successfully!
              </span>
            )}
          </h3>
        </motion.div>

        <p className="text-sm text-gray-400">
          {currentStep < 4
            ? "Please wait while we process your request"
            : "Your knowledge base is ready to use"}
        </p>

        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4"
          >
            <Button
              className="bg-[#C1FF00] text-black hover:bg-[#d2ff4d]"
              onClick={onClose}
            >
              Go to Dashboard
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#0A0A0A] rounded-xl p-6 w-full max-w-md border border-[#1A1A1A] shadow-xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                {currentStep === 0
                  ? "Create Knowledge Base"
                  : "Creating Knowledge Base"}
              </h2>
              {currentStep === 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-[#111111]"
                  onClick={onClose}
                >
                  <X className="h-5 w-5 text-gray-400" />
                </Button>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep === 0 ? "form" : "loading"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0
                  ? renderFormContent()
                  : renderLoadingContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
