// src/presentation/store/NotebookContext.tsx
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AddBlockUseCase } from "../../application/useCases/AddBlockUseCase";
import { CreateNotebookUseCase } from "../../application/useCases/CreateNotebookUseCase";
import { DeleteBlockUseCase } from "../../application/useCases/DeleteBlockUseCase";
import { DeleteNotebookUseCase } from "../../application/useCases/DeleteNotebookUseCase";
import { ToggleTaskUseCase } from "../../application/useCases/ToggleTaskUseCase";
import { UpdateBlockUseCase } from "../../application/useCases/UpdateBlockUseCase";
import { Notebook } from "../../domain/entities/Notebook";
import { AsyncStorageNotebookRepository } from "../../infrastructure/repositories/AsyncStorageNotebookRepository";

const repository = new AsyncStorageNotebookRepository();

const createNotebookUseCase = new CreateNotebookUseCase(repository);
const deleteNotebookUseCase = new DeleteNotebookUseCase(repository);
const addBlockUseCase = new AddBlockUseCase(repository);
const deleteBlockUseCase = new DeleteBlockUseCase(repository);
const updateBlockUseCase = new UpdateBlockUseCase(repository);
const toggleTaskUseCase = new ToggleTaskUseCase(repository);

export type BlockType = "paragraph" | "task" | "reminder" | "meeting";

interface NotebookContextData {
  notebooks: Notebook[];
  isLoading: boolean;
  loadNotebooks: () => Promise<void>;
  createNotebook: (
    title: string,
    description: string,
    type: "notebook" | "todo",
  ) => Promise<void>;
  deleteNotebook: (id: string) => Promise<void>;
  addBlock: (
    notebookId: string,
    content: string,
    type?: BlockType,
    extra?: { date?: Date; url?: string },
  ) => Promise<void>;
  deleteBlock: (notebookId: string, blockId: string) => Promise<void>;
  updateBlock: (
    notebookId: string,
    blockId: string,
    content: string,
    type?: BlockType,
    extra?: { date?: Date; url?: string },
  ) => Promise<void>;
  toggleTask: (notebookId: string, taskId: string) => Promise<void>;
}

const NotebookContext = createContext<NotebookContextData>(
  {} as NotebookContextData,
);

export const NotebookProvider = ({ children }: { children: ReactNode }) => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotebooks = async () => {
    setIsLoading(true);
    try {
      const data = await repository.getAll();
      setNotebooks(
        data.filter((n) => !n.isDeleted && typeof n.title === "string"),
      );
    } catch (error) {
      console.error("Erro ao carregar cadernos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotebooks();
  }, []);

  const createNotebook = async (
    title: string,
    description: string,
    type: "notebook" | "todo",
  ) => {
    await createNotebookUseCase.execute(title, description, type);
    await loadNotebooks();
  };

  const deleteNotebook = async (id: string) => {
    await deleteNotebookUseCase.execute(id);
    await loadNotebooks();
  };

  const addBlock = async (
    notebookId: string,
    content: string,
    type: BlockType = "paragraph",
    extra?: { date?: Date; url?: string },
  ) => {
    let blockData: Record<string, unknown> = { type: "paragraph", content };

    if (type === "task")
      blockData = { type: "task", title: content, isCompleted: false };
    if (type === "reminder")
      blockData = {
        type: "reminder",
        title: content,
        date: extra?.date || new Date(),
        isCompleted: false,
      };
    if (type === "meeting")
      blockData = {
        type: "meeting",
        title: content,
        date: extra?.date || new Date(),
        url: extra?.url || "",
      };

    await addBlockUseCase.execute(
      notebookId,
      blockData as unknown as Parameters<typeof addBlockUseCase.execute>[1],
    );
    await loadNotebooks();
  };

  const deleteBlock = async (notebookId: string, blockId: string) => {
    await deleteBlockUseCase.execute(notebookId, blockId);
    await loadNotebooks();
  };

  const updateBlock = async (
    notebookId: string,
    blockId: string,
    content: string,
    type: BlockType = "paragraph",
    extra?: { date?: Date; url?: string },
  ) => {
    let updateData: Record<string, unknown> = { content };

    if (type === "task") updateData = { title: content };
    if (type === "reminder") updateData = { title: content, date: extra?.date };
    if (type === "meeting")
      updateData = { title: content, date: extra?.date, url: extra?.url };

    await updateBlockUseCase.execute(
      notebookId,
      blockId,
      updateData as unknown as Parameters<typeof updateBlockUseCase.execute>[2],
    );
    await loadNotebooks();
  };

  const toggleTask = async (notebookId: string, taskId: string) => {
    await toggleTaskUseCase.execute(notebookId, taskId);
    await loadNotebooks();
  };

  return (
    <NotebookContext.Provider
      value={{
        notebooks,
        isLoading,
        loadNotebooks,
        createNotebook,
        deleteNotebook,
        addBlock,
        deleteBlock,
        updateBlock,
        toggleTask,
      }}
    >
      {children}
    </NotebookContext.Provider>
  );
};

export const useNotebooks = () => {
  const context = useContext(NotebookContext);
  if (!context) {
    throw new Error(
      "useNotebooks deve ser usado dentro de um NotebookProvider",
    );
  }
  return context;
};
