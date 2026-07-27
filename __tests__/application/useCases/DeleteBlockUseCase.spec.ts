import { DeleteBlockUseCase } from "../../../src/application/useCases/DeleteBlockUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("DeleteBlockUseCase (Soft Delete)", () => {
  it("deve enviar a anotação para a lixeira (isDeleted = true)", async () => {
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
          content: "Texto",
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    const useCase = new DeleteBlockUseCase(repository);
    await useCase.execute("caderno-1", "bloco-1");

    const notebook = await repository.getById("caderno-1");

    expect(notebook?.blocks.length).toBe(1);
    expect(notebook?.blocks[0].isDeleted).toBe(true);
  });
});
