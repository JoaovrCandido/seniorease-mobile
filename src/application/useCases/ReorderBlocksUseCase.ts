import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class ReorderBlocksUseCase {
  constructor(private notebookRepository: INotebookRepository) {}

  async execute(notebookId: string, newOrderIds: string[]): Promise<void> {
    const notebook = await this.notebookRepository.getById(notebookId);
    if (!notebook) return;

    // Reordena o array principal com base no novo array de IDs fornecido
    notebook.blocks.sort((a, b) => {
      let indexA = newOrderIds.indexOf(a.id);
      let indexB = newOrderIds.indexOf(b.id);

      // Se um bloco estiver apagado (na lixeira) e não vier na lista, empurramos para o fim
      if (indexA === -1) indexA = 999999;
      if (indexB === -1) indexB = 999999;

      return indexA - indexB;
    });

    notebook.updatedAt = new Date();
    await this.notebookRepository.save(notebook);
  }
}
