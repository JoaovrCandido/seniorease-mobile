import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class DeleteBlockUseCase {
  constructor(private notebookRepository: INotebookRepository) {}

  async execute(notebookId: string, blockId: string): Promise<void> {
    const notebook = await this.notebookRepository.getById(notebookId);
    if (notebook) {
      const block = notebook.blocks.find((b) => b.id === blockId);
      if (block) {
        block.isDeleted = true;
        notebook.updatedAt = new Date();
        await this.notebookRepository.save(notebook);
      }
    }
  }
}
