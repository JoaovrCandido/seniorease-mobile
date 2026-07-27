import AsyncStorage from "@react-native-async-storage/async-storage";
import { Notebook } from "../../../src/domain/entities/Notebook";
import { AsyncStorageNotebookRepository } from "../../../src/infrastructure/repositories/AsyncStorageNotebookRepository";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("AsyncStorageNotebookRepository", () => {
  let repository: AsyncStorageNotebookRepository;
  const STORAGE_KEY = "@SeniorEase:notebooks";

  beforeEach(() => {
    repository = new AsyncStorageNotebookRepository();
    jest.clearAllMocks();
  });

  it("deve retornar uma lista vazia se não houver cadernos guardados", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

    const notebooks = await repository.getAll();
    expect(notebooks).toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it("deve salvar um novo caderno e converter as datas corretamente", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

    const newNotebook: Notebook = {
      id: "caderno-1",
      title: "Saúde",
      icon: "❤️",
      description: "",
      createdAt: new Date("2026-01-01T10:00:00Z"),
      updatedAt: new Date("2026-01-01T10:00:00Z"),
      isDeleted: false,
      blocks: [],
    };

    await repository.save(newNotebook);

    expect(AsyncStorage.setItem).toHaveBeenCalled();
    const savedArgument = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
    expect(savedArgument).toContain("caderno-1");
    expect(savedArgument).toContain("Saúde");
  });

  it("deve apagar fisicamente um caderno pela sua ID", async () => {
    // CORREÇÃO: Adicionada a propriedade 'blocks: []' para evitar o erro do .map
    const mockData = [
      { id: "caderno-1", title: "Saúde", blocks: [] },
      { id: "caderno-2", title: "Compras", blocks: [] },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockData),
    );

    await repository.delete("caderno-1");

    const savedArgument = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
    const parsedSave = JSON.parse(savedArgument) as Record<string, unknown>[];

    expect(parsedSave.length).toBe(1);
    expect(parsedSave[0].id).toBe("caderno-2");
  });
});
