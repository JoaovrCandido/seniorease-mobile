import { DeleteNotebookUseCase } from "../../../src/application/useCases/DeleteNotebookUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("DeleteNotebookUseCase (Soft Delete)", () => {
  it("deve marcar o caderno como apagado (isDeleted = true) sem o remover do repositório", async () => {
    const repository = new MockNotebookRepository();
    repository.notebooks.push({
      id: "caderno-1",
      title: "Teste",
      description: "",
      icon: "📘",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      blocks: [],
    });

    const useCase = new DeleteNotebookUseCase(repository);
    await useCase.execute("caderno-1");

    const notebook = await repository.getById("caderno-1");
    expect(notebook).toBeDefined();
    expect(notebook?.isDeleted).toBe(true);
  });
});
