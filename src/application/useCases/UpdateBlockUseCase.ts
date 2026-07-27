import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class UpdateBlockUseCase {
  constructor(private notebookRepository: INotebookRepository) {}

  async execute(
    notebookId: string,
    blockId: string,
    newContent: unknown,
    newType: string,
    extra?: { date?: Date; url?: string },
  ): Promise<void> {
    const notebook = await this.notebookRepository.getById(notebookId);

    if (notebook) {
      const blockIndex = notebook.blocks.findIndex((b) => b.id === blockId);

      if (blockIndex !== -1) {
        // Atualiza as propriedades base
        notebook.blocks[blockIndex].content = newContent;
        notebook.blocks[blockIndex].type = newType;

        // Atualiza as propriedades extra de forma segura (Type Assertion)
        const blockAsRecord = notebook.blocks[blockIndex] as Record<
          string,
          unknown
        >;

        if (extra?.date) {
          blockAsRecord.date = extra.date;
        }
        if (extra?.url) {
          blockAsRecord.url = extra.url;
        }

        notebook.updatedAt = new Date();
        await this.notebookRepository.save(notebook);
      }
    }
  }
}
