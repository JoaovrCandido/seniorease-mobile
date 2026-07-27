import { RestoreNotebookUseCase } from "../../../src/application/useCases/RestoreNotebookUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("RestoreNotebookUseCase", () => {
  it("deve restaurar um caderno da lixeira mudando isDeleted para false", async () => {
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

    const useCase = new RestoreNotebookUseCase(repository);
    await useCase.execute("caderno-1");

    const notebook = await repository.getById("caderno-1");
    expect(notebook?.isDeleted).toBe(false);
  });
});
