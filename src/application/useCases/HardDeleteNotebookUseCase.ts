import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class HardDeleteNotebookUseCase {
  constructor(private notebookRepository: INotebookRepository) {}

  async execute(id: string): Promise<void> {
    // Aqui sim, removemos fisicamente do AsyncStorage
    await this.notebookRepository.delete(id);
  }
}
