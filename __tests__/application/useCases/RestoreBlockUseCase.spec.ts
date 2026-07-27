import { RestoreBlockUseCase } from "../../../src/application/useCases/RestoreBlockUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("RestoreBlockUseCase", () => {
  it("deve restaurar um bloco apagado", async () => {
    const repo = new MockNotebookRepository();
    repo.getById = jest.fn().mockResolvedValue({
      id: "1",
      title: "Caderno",
      icon: "📘",
      blocks: [
        {
          id: "b1",
          type: "paragraph",
          content: "Texto",
          isDeleted: true,
        } as any,
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });
    repo.save = jest.fn();

    const useCase = new RestoreBlockUseCase(repo);
    await useCase.execute("1", "b1");

    expect(repo.save).toHaveBeenCalled();
    const savedNotebook = (repo.save as jest.Mock).mock.calls[0][0];
    expect(savedNotebook.blocks[0].isDeleted).toBe(false);
  });
});
