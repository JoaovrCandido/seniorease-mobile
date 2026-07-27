import { ReorderBlocksUseCase } from "../../../src/application/useCases/ReorderBlocksUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("ReorderBlocksUseCase", () => {
  it("deve reordenar os blocos com base numa matriz de IDs", async () => {
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
          content: "Primeiro",
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "bloco-2",
          type: "paragraph",
          content: "Segundo",
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    const useCase = new ReorderBlocksUseCase(repository);

    await useCase.execute("caderno-1", ["bloco-2", "bloco-1"]);

    const notebook = await repository.getById("caderno-1");
    expect(notebook?.blocks[0].id).toBe("bloco-2");
    expect(notebook?.blocks[1].id).toBe("bloco-1");
  });
});
