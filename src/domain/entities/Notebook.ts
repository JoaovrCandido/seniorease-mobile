import { ContentBlock } from "./Block";

export type NotebookType = "notebook" | "todo";

export interface Notebook {
  id: string;
  title: string;
  icon: string;
  description?: string;
  blocks: ContentBlock[];
  isDeleted?: boolean;
  type?: NotebookType;
  createdAt: Date;
  updatedAt: Date;
}
