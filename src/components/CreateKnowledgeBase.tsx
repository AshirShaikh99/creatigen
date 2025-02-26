import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export default function CreateKnowledgeBase() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-white">
        Create Knowledge Base
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Knowledge Base Name</Label>
          <Input id="name" placeholder="Enter a name for your knowledge base" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your knowledge base"
          />
        </div>
        <div>
          <Label htmlFor="file-upload">Attach Files</Label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-purple-500 hover:text-purple-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                >
                  <span>Upload files</span>
                  <Input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileChange}
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
          <div>
            <h4 className="text-sm font-medium text-white">Attached Files:</h4>
            <ul className="mt-2 divide-y divide-gray-800">
              {files.map((file, index) => (
                <li key={index} className="py-2 text-sm text-gray-400">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button type="submit" className="w-full">
          Create Knowledge Base
        </Button>
      </form>
    </div>
  );
}
