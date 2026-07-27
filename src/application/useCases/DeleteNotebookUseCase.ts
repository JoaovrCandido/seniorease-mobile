import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class DeleteNotebookUseCase {
  constructor(private notebookRepository: INotebookRepository) {}

  async execute(id: string): Promise<void> {
    const notebook = await this.notebookRepository.getById(id);
    if (notebook) {
      notebook.isDeleted = true;
      notebook.updatedAt = new Date();
      await this.notebookRepository.save(notebook);
    }
  }
}
