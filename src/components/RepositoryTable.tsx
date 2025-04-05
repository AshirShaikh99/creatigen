"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Folder,
  FolderOpen,
  FileText,
  Clock,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Repository {
  id: string;
  name: string;
  description: string;
  dateCreated: string;
  documentCount: number;
  uuid?: string;
}

interface RepositoryTableProps {
  repositories: Repository[];
  onSelectRepository: (id: string) => void;
}

export function RepositoryTable({
  repositories,
  onSelectRepository,
}: RepositoryTableProps) {
  const [hoveredRepo, setHoveredRepo] = useState<string | null>(null);

  const columns: ColumnDef<Repository>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent text-muted-foreground font-medium"
          >
            Repository
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        );
      },
      cell: ({ row }) => {
        const repo = row.original;
        const id = repo.uuid || repo.id;

        return (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center"
              onMouseEnter={() => setHoveredRepo(id)}
              onMouseLeave={() => setHoveredRepo(null)}
            >
              {hoveredRepo === id ? (
                <FolderOpen className="w-5 h-5 text-primary-foreground" />
              ) : (
                <Folder className="w-5 h-5 text-primary-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-foreground">{repo.name}</h3>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        return (
          <div className="max-w-xs truncate text-muted-foreground">
            {row.original.description}
          </div>
        );
      },
    },
    {
      accessorKey: "dateCreated",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent text-muted-foreground font-medium"
          >
            Created
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {row.original.dateCreated}
          </div>
        );
      },
    },
    {
      accessorKey: "documentCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent text-muted-foreground font-medium"
          >
            Documents
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FileText className="w-3.5 h-3.5" />
            {row.original.documentCount}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const repo = row.original;

        return (
          <div className="text-right">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-accent hover:bg-primary/10"
              onClick={() => onSelectRepository(repo.uuid || repo.id)}
            >
              Open <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (repositories.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
          <Folder className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium text-foreground mb-2">
          No repositories yet
        </h3>
        <p className="text-muted-foreground mb-6">
          Create your first repository to get started
        </p>
        <Button className="bg-gradient-to-r from-accent to-primary text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" /> Create Repository
        </Button>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={repositories}
      searchKey="name"
      searchPlaceholder="Search repositories..."
    />
  );
}
