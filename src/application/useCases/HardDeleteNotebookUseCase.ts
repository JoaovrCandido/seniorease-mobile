import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class HardDeleteNotebookUseCase {
  constructor(private notebookRepository: INotebookRepository) {}

  async execute(id: string): Promise<void> {
    await this.notebookRepository.delete(id);
  }
}
