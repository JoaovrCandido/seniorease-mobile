import AsyncStorage from "@react-native-async-storage/async-storage";
import { Notebook } from "../../domain/entities/Notebook";
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

const STORAGE_KEY = "@SeniorEase:notebooks";

export class AsyncStorageNotebookRepository implements INotebookRepository {
  async getAll(): Promise<Notebook[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const parsedData = JSON.parse(data);

      return parsedData.map((notebook: any) => ({
        ...notebook,
        createdAt: new Date(notebook.createdAt),
        updatedAt: new Date(notebook.updatedAt),
        blocks: notebook.blocks.map((block: any) => ({
          ...block,
          date: block.date ? new Date(block.date) : undefined,
        })),
      }));
    } catch (error) {
      console.error("Erro ao ler cadernos do AsyncStorage:", error);
      return [];
    }
  }

  async getById(id: string): Promise<Notebook | null> {
    const notebooks = await this.getAll();
    return notebooks.find((n) => n.id === id) || null;
  }

  async save(notebook: Notebook): Promise<void> {
    const notebooks = await this.getAll();
    const index = notebooks.findIndex((n) => n.id === notebook.id);

    if (index >= 0) {
      notebooks[index] = notebook;
    } else {
      notebooks.push(notebook);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks));
  }

  async delete(id: string): Promise<void> {
    const notebooks = await this.getAll();
    const filtered = notebooks.filter((n) => n.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
}
