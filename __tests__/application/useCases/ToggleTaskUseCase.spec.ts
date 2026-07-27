import { ToggleTaskUseCase } from "../../../src/application/useCases/ToggleTaskUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("ToggleTaskUseCase", () => {
  it("deve alternar o status isCompleted de uma anotação do tipo tarefa", async () => {
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
          id: "task-1",
          type: "task",
          content: "Comprar leite",
          isCompleted: false,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    const useCase = new ToggleTaskUseCase(repository);

    await useCase.execute("caderno-1", "task-1");
    let notebook = await repository.getById("caderno-1");

    if (notebook && "isCompleted" in notebook.blocks[0]) {
      expect(notebook.blocks[0].isCompleted).toBe(true);
    }

    await useCase.execute("caderno-1", "task-1");
    notebook = await repository.getById("caderno-1");

    if (notebook && "isCompleted" in notebook.blocks[0]) {
      expect(notebook.blocks[0].isCompleted).toBe(false);
    }
  });
});
