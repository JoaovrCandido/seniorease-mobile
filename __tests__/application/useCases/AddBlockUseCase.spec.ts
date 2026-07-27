import { AddBlockUseCase } from "../../../src/application/useCases/AddBlockUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("AddBlockUseCase", () => {
  it("deve adicionar uma nova anotação de texto a um caderno", async () => {
    const repository = new MockNotebookRepository();
    repository.notebooks.push({
      id: "caderno-1",
      title: "Teste",
      description: "",
      icon: "📘",
      createdAt: new Date(),
      updatedAt: new Date(),
      blocks: [],
      isDeleted: false,
    });

    const useCase = new AddBlockUseCase(repository);
    await useCase.execute("caderno-1", "Comprar pão", "paragraph");

    const notebook = await repository.getById("caderno-1");
    expect(notebook?.blocks.length).toBe(1);
    expect(notebook?.blocks[0].content).toBe("Comprar pão");
    expect(notebook?.blocks[0].type).toBe("paragraph");
  });
});
