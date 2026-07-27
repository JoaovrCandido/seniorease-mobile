import { ToggleTaskUseCase } from "../../../src/application/useCases/ToggleTaskUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("ToggleTaskUseCase", () => {
  it("deve alternar o status da tarefa", async () => {
    const repo = new MockNotebookRepository();
    repo.getById = jest.fn().mockResolvedValue({
      id: "1",
      title: "Caderno",
      icon: "📘",
      blocks: [
        {
          id: "b1",
          type: "task",
          content: "Tarefa",
          isCompleted: false,
          isDeleted: false,
        } as any,
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });
    repo.save = jest.fn();

    const useCase = new ToggleTaskUseCase(repo);
    await useCase.execute("1", "b1");

    expect(repo.save).toHaveBeenCalled();
    const savedNotebook = (repo.save as jest.Mock).mock.calls[0][0];
    expect((savedNotebook.blocks[0] as any).isCompleted).toBe(true);
  });
});
