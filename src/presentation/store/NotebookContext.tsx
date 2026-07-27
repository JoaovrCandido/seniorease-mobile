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
import { HardDeleteBlockUseCase } from "../../application/useCases/HardDeleteBlockUseCase";
import { HardDeleteNotebookUseCase } from "../../application/useCases/HardDeleteNotebookUseCase";
import { ReorderBlocksUseCase } from "../../application/useCases/ReorderBlocksUseCase";
import { RestoreBlockUseCase } from "../../application/useCases/RestoreBlockUseCase";
import { RestoreNotebookUseCase } from "../../application/useCases/RestoreNotebookUseCase";
import { ToggleTaskUseCase } from "../../application/useCases/ToggleTaskUseCase";
import { UpdateBlockUseCase } from "../../application/useCases/UpdateBlockUseCase";
import { UpdateNotebookUseCase } from "../../application/useCases/UpdateNotebookUseCase";
import { Notebook } from "../../domain/entities/Notebook";
import { AsyncStorageNotebookRepository } from "../../infrastructure/repositories/AsyncStorageNotebookRepository";

const repository = new AsyncStorageNotebookRepository();

const createNotebookUseCase = new CreateNotebookUseCase(repository);
const deleteNotebookUseCase = new DeleteNotebookUseCase(repository);
const restoreNotebookUseCase = new RestoreNotebookUseCase(repository);
const hardDeleteNotebookUseCase = new HardDeleteNotebookUseCase(repository);
const updateNotebookUseCase = new UpdateNotebookUseCase(repository);

const addBlockUseCase = new AddBlockUseCase(repository);
const deleteBlockUseCase = new DeleteBlockUseCase(repository);
const restoreBlockUseCase = new RestoreBlockUseCase(repository);
const hardDeleteBlockUseCase = new HardDeleteBlockUseCase(repository);
const reorderBlocksUseCase = new ReorderBlocksUseCase(repository);
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
    icon: string,
  ) => Promise<Notebook>;
  deleteNotebook: (id: string) => Promise<void>;
  restoreNotebook: (id: string) => Promise<void>;
  hardDeleteNotebook: (id: string) => Promise<void>;
  updateNotebook: (
    id: string,
    title: string,
    description: string,
    icon: string,
  ) => Promise<void>;
  addBlock: (
    notebookId: string,
    content: string,
    type?: BlockType,
    extra?: { date?: Date; url?: string },
  ) => Promise<void>;
  deleteBlock: (notebookId: string, blockId: string) => Promise<void>;
  restoreBlock: (notebookId: string, blockId: string) => Promise<void>;
  hardDeleteBlock: (notebookId: string, blockId: string) => Promise<void>;
  reorderBlocks: (notebookId: string, newOrderIds: string[]) => Promise<void>;
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
      setNotebooks(data.filter((n) => typeof n.title === "string"));
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
    icon: string,
  ) => {
    const newNotebook = await createNotebookUseCase.execute(
      title,
      description,
      icon,
    );
    setNotebooks((prev) => [...prev, newNotebook]);
    return newNotebook;
  };

  const updateNotebook = async (
    id: string,
    title: string,
    description: string,
    icon: string,
  ) => {
    await updateNotebookUseCase.execute(id, title, description, icon);
    await loadNotebooks();
  };

  const deleteNotebook = async (id: string) => {
    await deleteNotebookUseCase.execute(id);
    await loadNotebooks();
  };

  const restoreNotebook = async (id: string) => {
    await restoreNotebookUseCase.execute(id);
    await loadNotebooks();
  };

  const hardDeleteNotebook = async (id: string) => {
    await hardDeleteNotebookUseCase.execute(id);
    await loadNotebooks();
  };

  const addBlock = async (
    notebookId: string,
    content: string,
    type: BlockType = "paragraph",
    extra?: { date?: Date; url?: string },
  ) => {
    await addBlockUseCase.execute(notebookId, content, type, {
      url: extra?.url,
      date: extra?.date,
    });
    await loadNotebooks();
  };

  const deleteBlock = async (notebookId: string, blockId: string) => {
    await deleteBlockUseCase.execute(notebookId, blockId);
    await loadNotebooks();
  };

  const restoreBlock = async (notebookId: string, blockId: string) => {
    await restoreBlockUseCase.execute(notebookId, blockId);
    await loadNotebooks();
  };

  const hardDeleteBlock = async (notebookId: string, blockId: string) => {
    await hardDeleteBlockUseCase.execute(notebookId, blockId);
    await loadNotebooks();
  };

  const updateBlock = async (
    notebookId: string,
    blockId: string,
    content: string,
    type: BlockType = "paragraph",
    extra?: { date?: Date; url?: string },
  ) => {
    await updateBlockUseCase.execute(notebookId, blockId, content, type, {
      url: extra?.url,
      date: extra?.date,
    });
    await loadNotebooks();
  };

  const reorderBlocks = async (notebookId: string, newOrderIds: string[]) => {
    await reorderBlocksUseCase.execute(notebookId, newOrderIds);
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
        updateNotebook,
        deleteNotebook,
        restoreNotebook,
        hardDeleteNotebook,
        addBlock,
        deleteBlock,
        restoreBlock,
        hardDeleteBlock,
        reorderBlocks,
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
  if (!context)
    throw new Error(
      "useNotebooks deve ser usado dentro de um NotebookProvider",
    );
  return context;
};
