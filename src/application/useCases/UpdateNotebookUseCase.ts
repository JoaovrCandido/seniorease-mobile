import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class UpdateNotebookUseCase {
  constructor(private notebookRepository: INotebookRepository) {}

  async execute(
    id: string,
    title: string,
    description: string,
    icon: string,
  ): Promise<void> {
    const notebook = await this.notebookRepository.getById(id);
    if (notebook) {
      notebook.title = title;
      notebook.description = description;
      notebook.icon = icon;
      notebook.updatedAt = new Date();
      await this.notebookRepository.save(notebook);
    }
  }
}
