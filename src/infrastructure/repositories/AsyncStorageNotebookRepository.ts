// src/infrastructure/repositories/AsyncStorageNotebookRepository.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Notebook } from "../../domain/entities/Notebook";
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

const STORAGE_KEY = "@SeniorEase:notebooks";

export class AsyncStorageNotebookRepository implements INotebookRepository {
  async getAll(): Promise<Notebook[]> {
    try {
      // No AsyncStorage, as chamadas são sempre assíncronas (await)
      const rawData = await AsyncStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        return [];
      }

      const parsedData = JSON.parse(rawData) as Notebook[];

      // Exatamente igual à Web: reidratar as datas que o JSON converteu em texto
      return parsedData.map((notebook) => ({
        ...notebook,
        createdAt: new Date(notebook.createdAt),
        updatedAt: new Date(notebook.updatedAt),
      }));
    } catch (error) {
      console.error("Falha ao ler os dados do AsyncStorage:", error);
      return [];
    }
  }

  async getById(id: string): Promise<Notebook | null> {
    const notebooks = await this.getAll();
    const notebook = notebooks.find((n) => n.id === id);

    return notebook || null;
  }

  async save(notebook: Notebook): Promise<void> {
    try {
      const notebooks = await this.getAll();
      const existingIndex = notebooks.findIndex((n) => n.id === notebook.id);

      if (existingIndex >= 0) {
        // Atualiza o caderno existente
        notebooks[existingIndex] = notebook;
      } else {
        // Adiciona um novo caderno
        notebooks.push(notebook);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks));
    } catch (error) {
      console.error("Falha ao salvar no AsyncStorage:", error);
      throw new Error("Não foi possível salvar o caderno no dispositivo.");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const rawData = await AsyncStorage.getItem(STORAGE_KEY);
      if (rawData) {
        // Tipagem segura sem 'any'
        const notebooks = JSON.parse(rawData) as { id: string }[];
        const filtered = notebooks.filter((n) => n.id !== id);

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      }
    } catch (error) {
      console.error("Falha ao apagar do AsyncStorage:", error);
      throw new Error("Não foi possível apagar o caderno.");
    }
  }
}
