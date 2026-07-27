import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class ReorderBlocksUseCase {
  constructor(private notebookRepository: INotebookRepository) {}

  async execute(notebookId: string, newOrderIds: string[]): Promise<void> {
    const notebook = await this.notebookRepository.getById(notebookId);
    if (!notebook) return;

    notebook.blocks.sort((a, b) => {
      let indexA = newOrderIds.indexOf(a.id);
      let indexB = newOrderIds.indexOf(b.id);

      if (indexA === -1) indexA = 999999;
      if (indexB === -1) indexB = 999999;

      return indexA - indexB;
    });

    notebook.updatedAt = new Date();
    await this.notebookRepository.save(notebook);
  }
}
