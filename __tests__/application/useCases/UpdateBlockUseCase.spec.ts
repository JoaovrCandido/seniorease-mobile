import { UpdateBlockUseCase } from "../../../src/application/useCases/UpdateBlockUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("UpdateBlockUseCase", () => {
  it("deve atualizar o bloco", async () => {
    const repo = new MockNotebookRepository();
    repo.getById = jest.fn().mockResolvedValue({
      id: "1",
      title: "Caderno",
      icon: "📘",
      blocks: [
        {
          id: "b1",
          type: "paragraph",
          content: "Texto antigo",
          isDeleted: false,
        } as any,
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });
    repo.save = jest.fn();

    const useCase = new UpdateBlockUseCase(repo);
    await useCase.execute("1", "b1", "Texto novo", "paragraph");

    expect(repo.save).toHaveBeenCalled();
    const savedNotebook = (repo.save as jest.Mock).mock.calls[0][0];
    expect((savedNotebook.blocks[0] as any).content).toBe("Texto novo");
  });
});
