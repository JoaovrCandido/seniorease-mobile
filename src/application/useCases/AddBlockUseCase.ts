import { BlockType, ContentBlock } from "../../domain/entities/Block";
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export class AddBlockUseCase {
  constructor(private notebookRepository: INotebookRepository) {}

  async execute(
    notebookId: string,
    content: string,
    type: BlockType,
    extra?: { url?: string; date?: Date },
  ): Promise<void> {
    const notebook = await this.notebookRepository.getById(notebookId);
    if (!notebook) throw new Error("Caderno não encontrado");

    const baseBlock = {
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };

    let newBlock: ContentBlock;

    if (type === "task") {
      newBlock = { ...baseBlock, type: "task", content, isCompleted: false };
    } else if (type === "meeting") {
      newBlock = {
        ...baseBlock,
        type: "meeting",
        title: content,
        meetingUrl: extra?.url || "",
        date: extra?.date ? extra.date.toISOString() : new Date().toISOString(),
      };
    } else if (type === "reminder") {
      newBlock = {
        ...baseBlock,
        type: "reminder",
        content,
        date: extra?.date ? extra.date.toISOString() : new Date().toISOString(),
      };
    } else if (type === "heading") {
      newBlock = { ...baseBlock, type: "heading", content };
    } else {
      newBlock = { ...baseBlock, type: "paragraph", content };
    }

    notebook.blocks.push(newBlock);
    notebook.updatedAt = new Date();

    await this.notebookRepository.save(notebook);
  }
}
