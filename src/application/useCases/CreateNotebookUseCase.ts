import { Notebook } from "../../domain/entities/Notebook";
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export class CreateNotebookUseCase {
  constructor(private notebookRepository: INotebookRepository) {}

  async execute(
    title: string,
    description: string,
    icon: string,
  ): Promise<Notebook> {
    const newNotebook: Notebook = {
      id: generateUUID(),
      title,
      description,
      icon,
      blocks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.notebookRepository.save(newNotebook);
    return newNotebook;
  }
}
