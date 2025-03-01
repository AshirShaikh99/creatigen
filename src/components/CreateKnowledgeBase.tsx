"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface CreateKnowledgebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string, files: File[]) => void;
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
> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: createKnowledgeBase,
    onSuccess: () => {
      toast.success("Knowledge base created successfully!");
      onCreate(name, description, files);
      handleReset();
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to create knowledge base. Please try again.");
      console.error("Error creating knowledge base:", error);
    },
  });

  const handleReset = () => {
    setName("");
    setDescription("");
    setFiles([]);
    setCurrentStep(0);
  };

  const handleCreate = async () => {
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

    files.forEach((file) => {
      formData.append("document", file);
    });

    mutate(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((file) => {
      const isValidType = [
        "application/pdf",
        "application/msword",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      if (!isValidType) toast.error(`Invalid file type: ${file.name}`);
      if (!isValidSize) toast.error(`File too large: ${file.name}`);
      return isValidType && isValidSize;
    });
    setFiles(validFiles);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                Create Knowledgebase
              </h2>
              <Button variant="ghost" onClick={onClose}>
                <X className="h-6 w-6 text-gray-400" />
              </Button>
            </div>
            {!isLoading ? (
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
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Attach Documents
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-bold">Click to upload</span> or
                          drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                          PDF, DOCX, TXT (MAX. 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
                {files.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-300 mb-2">
                      Attached Files:
                    </p>
                    <ul className="text-sm text-gray-400">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span>{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setFiles(files.filter((_, i) => i !== index))
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Button onClick={handleCreate} className="w-full">
                  Create Knowledgebase
                </Button>
              </>
            ) : (
              <div className="text-center">
                <div className="mb-4">
                  <motion.div
                    className="w-16 h-16 border-4 border-[#C1FF00] border-t-transparent rounded-full mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                </div>
                <p className="text-lg font-medium text-white mb-2">
                  Processing...
                </p>
                <p className="text-sm text-gray-400">
                  {
                    ["Initializing", "Processing documents", "Finalizing"][
                      currentStep
                    ]
                  }
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
