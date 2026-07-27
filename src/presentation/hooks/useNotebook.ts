import { BlockType, useNotebooks } from "../store/NotebookContext";

interface ExtraBlockData {
  url?: string;
  date?: Date;
}

export const useNotebook = (notebookId: string) => {
  const { notebooks, addBlock, deleteBlock, updateBlock, toggleTask } =
    useNotebooks();

  const notebook = notebooks.find((n) => n.id === notebookId);

  const handleAddBlock = async (
    content: string,
    type: BlockType,
    extra?: ExtraBlockData,
  ) => {
    await addBlock(notebookId, content, type, extra);
  };

  const handleDeleteBlock = async (blockId: string) => {
    await deleteBlock(notebookId, blockId);
  };

  const handleUpdateBlock = async (
    blockId: string,
    content: string,
    type: BlockType,
    extra?: ExtraBlockData,
  ) => {
    await updateBlock(notebookId, blockId, content, type, extra);
  };

  const handleToggleTask = async (blockId: string) => {
    await toggleTask(notebookId, blockId);
  };

  return {
    notebook,
    addBlock: handleAddBlock,
    deleteBlock: handleDeleteBlock,
    updateBlock: handleUpdateBlock,
    toggleTask: handleToggleTask,
  };
};
