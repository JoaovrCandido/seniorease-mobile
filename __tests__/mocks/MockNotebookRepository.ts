import { Notebook } from "../../src/domain/entities/Notebook";
import { INotebookRepository } from "../../src/domain/repositories/INotebookRepository";

export class MockNotebookRepository implements INotebookRepository {
  public notebooks: Notebook[] = [];

  async getAll(): Promise<Notebook[]> {
    return this.notebooks;
  }

  async getById(id: string): Promise<Notebook | null> {
    return this.notebooks.find((n) => n.id === id) || null;
  }

  async save(notebook: Notebook): Promise<void> {
    const index = this.notebooks.findIndex((n) => n.id === notebook.id);
    if (index >= 0) {
      this.notebooks[index] = notebook;
    } else {
      this.notebooks.push(notebook);
    }
  }

  async delete(id: string): Promise<void> {
    this.notebooks = this.notebooks.filter((n) => n.id !== id);
  }
}
