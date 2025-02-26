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
import { GitBranch, Search } from "lucide-react";

export function ExploreRepositoriesDialog({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-purple-600 hover:bg-purple-700">
            <GitBranch className="mr-2 h-4 w-4" />
            Explore Repositories
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border border-purple-500/20 bg-[#0F0522]/90 backdrop-blur-xl text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-purple-400" />
            Explore Repositories
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search repositories..."
              className="bg-white/5 border-purple-500/20 text-white pl-10 placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">No repositories found</p>
            <p className="text-sm text-gray-400">
              Create your first knowledge base to get started
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-purple-500/20 text-gray-300 hover:bg-purple-500/10 hover:text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
