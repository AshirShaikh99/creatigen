"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Plus } from "lucide-react";

export function CreateKnowledgeBaseDialog({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-4 cursor-pointer group">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-medium text-center">
              Create Knowledge Base
            </span>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border border-amber-500/20 bg-[#0F0A05]/90 backdrop-blur-xl text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Brain className="h-5 w-5 text-amber-400" />
            Create Knowledge Base
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <Input
              id="name"
              placeholder="My Knowledge Base"
              className="bg-white/5 border-amber-500/20 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Input
              id="description"
              placeholder="A brief description of your knowledge base"
              className="bg-white/5 border-amber-500/20 text-white placeholder:text-gray-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-amber-500/20 text-gray-300 hover:bg-amber-500/10 hover:text-white"
          >
            Cancel
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700">Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
