import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class HardDeleteBlockUseCase {
  constructor(private notebookRepository: INotebookRepository) {}

  async execute(notebookId: string, blockId: string): Promise<void> {
    const notebook = await this.notebookRepository.getById(notebookId);
    if (notebook) {
      notebook.blocks = notebook.blocks.filter((b) => b.id !== blockId); // Remove fisicamente
      notebook.updatedAt = new Date();
      await this.notebookRepository.save(notebook);
    }
  }
}
