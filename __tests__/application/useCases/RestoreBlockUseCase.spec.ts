import { RestoreBlockUseCase } from "../../../src/application/useCases/RestoreBlockUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("RestoreBlockUseCase", () => {
  it("deve restaurar uma anotação da lixeira mudando isDeleted para false", async () => {
    const repository = new MockNotebookRepository();
    repository.notebooks.push({
      id: "caderno-1",
      title: "Teste",
      description: "",
      icon: "📘",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      blocks: [
        {
          id: "bloco-1",
          type: "paragraph",
          content: "Texto apagado",
          isDeleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    const useCase = new RestoreBlockUseCase(repository);
    await useCase.execute("caderno-1", "bloco-1");

    const notebook = await repository.getById("caderno-1");
    expect(notebook?.blocks[0].isDeleted).toBe(false);
  });
});
