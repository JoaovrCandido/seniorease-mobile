import { HardDeleteBlockUseCase } from "../../../src/application/useCases/HardDeleteBlockUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("HardDeleteBlockUseCase", () => {
  it("deve remover fisicamente a anotação do array de blocos do caderno", async () => {
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
          isDeleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    const useCase = new HardDeleteBlockUseCase(repository);
    await useCase.execute("caderno-1", "bloco-1");

    const notebook = await repository.getById("caderno-1");
    expect(notebook?.blocks.length).toBe(0);
  });
});
