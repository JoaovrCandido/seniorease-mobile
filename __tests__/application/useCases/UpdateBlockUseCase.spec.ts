import { UpdateBlockUseCase } from "../../../src/application/useCases/UpdateBlockUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("UpdateBlockUseCase", () => {
  it("deve atualizar o conteúdo e o tipo de uma anotação existente", async () => {
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
          content: "Texto antigo",
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    const useCase = new UpdateBlockUseCase(repository);
    await useCase.execute("caderno-1", "bloco-1", "Texto novo", "task");

    const notebook = await repository.getById("caderno-1");
    expect(notebook?.blocks[0].content).toBe("Texto novo");
    expect(notebook?.blocks[0].type).toBe("task");
  });
});
