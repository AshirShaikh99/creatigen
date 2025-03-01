"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle2, FileText, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addKnowledgebase } from "@/app/lib/knowledgebase/knowledgebaseSlice";

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

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: createKnowledgeBase,
    onSuccess: (response) => {
      const knowledgebase = {
        id: response.id.toString(),
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

      // Simulate a multi-step process with timed animations
      const steps = [
        { step: 1, delay: 0 }, // Uploading files
        { step: 2, delay: 1500 }, // Processing documents
        { step: 3, delay: 3000 }, // Creating knowledgebase
        { step: 4, delay: 4500 }, // Complete
      ];

      steps.forEach(({ step, delay }) => {
        setTimeout(() => setCurrentStep(step), delay);
      });

      // Show success message and close after animation completes
      setTimeout(() => {
        toast.success("Knowledge base created successfully!");
        dispatch(addKnowledgebase(knowledgebase));
        handleReset();
        onClose();
      }, 5500);
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
    formData.append("uuid", "user1234");
    formData.append("title", name);
    formData.append("description", description);
    files.forEach((file) => formData.append("document", file));

    setCurrentStep(1);
    mutate(formData);
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
      color: "#10b981", // Green color for completed steps
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Animation variants for the progress bar
  const progressVariants = {
    initial: { width: "0%" },
    step1: { width: "25%" },
    step2: { width: "50%" },
    step3: { width: "75%" },
    step4: { width: "100%" },
  };

  const getStepStatus = (step: number) => {
    if (currentStep > step) return "completed";
    if (currentStep === step) return "active";
    return "inactive";
  };

  const renderFormContent = () => (
    <>
      <Input
        placeholder="Knowledgebase Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4"
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Upload Documents
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-400">
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
          <div className="mt-2">
            <p className="text-sm text-gray-300">Selected files:</p>
            <ul className="text-xs text-gray-400">
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Button onClick={handleCreate} className="w-full">
        Create Knowledgebase
      </Button>
    </>
  );

  const renderLoadingContent = () => (
    <div className="py-8">
      <div className="flex justify-center mb-8">
        <motion.div className="relative h-2 bg-gray-700 rounded-full w-full max-w-xs">
          <motion.div
            className="absolute h-2 bg-blue-500 rounded-full"
            initial="initial"
            animate={`step${currentStep}`}
            variants={progressVariants}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

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
              <Icon className="w-8 h-8" />
              {currentStep === step && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  style={{ width: "100%", height: "100%" }}
                />
              )}
            </div>
            <span className="text-xs text-center">{label}</span>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-lg font-medium mb-2">
          {currentStep === 1 && "Uploading your documents..."}
          {currentStep === 2 && "Processing document content..."}
          {currentStep === 3 && "Creating your knowledgebase..."}
          {currentStep === 4 && "Knowledgebase created successfully!"}
        </p>
        <p className="text-sm text-gray-400">
          {currentStep < 4
            ? "Please wait while we process your request"
            : "Your knowledgebase is ready to use"}
        </p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                {currentStep === 0
                  ? "Create Knowledgebase"
                  : "Creating Knowledgebase"}
              </h2>
              {currentStep === 0 && (
                <Button variant="ghost" onClick={onClose}>
                  <X className="h-6 w-6 text-gray-400" />
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
