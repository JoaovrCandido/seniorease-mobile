import { HardDeleteNotebookUseCase } from "../../../src/application/useCases/HardDeleteNotebookUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("HardDeleteNotebookUseCase", () => {
  it("deve remover fisicamente o caderno do repositório", async () => {
    const repository = new MockNotebookRepository();
    repository.notebooks.push({
      id: "caderno-1",
      title: "Teste",
      description: "",
      icon: "📘",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: true,
      blocks: [],
    });

    const useCase = new HardDeleteNotebookUseCase(repository);
    await useCase.execute("caderno-1");

    const notebooks = await repository.getAll();
    expect(notebooks.length).toBe(0);
  });
});
