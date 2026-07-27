import { ReorderBlocksUseCase } from "../../../src/application/useCases/ReorderBlocksUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("ReorderBlocksUseCase", () => {
  it("deve reordenar os blocos", async () => {
    const repo = new MockNotebookRepository();
    repo.getById = jest.fn().mockResolvedValue({
      id: "1",
      title: "Caderno",
      icon: "📘",
      blocks: [
        { id: "b1", type: "paragraph", content: "1", isDeleted: false } as any,
        { id: "b2", type: "paragraph", content: "2", isDeleted: false } as any,
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });
    repo.save = jest.fn();

    const useCase = new ReorderBlocksUseCase(repo);
    await useCase.execute("1", ["b2", "b1"]);

    expect(repo.save).toHaveBeenCalled();
    const savedNotebook = (repo.save as jest.Mock).mock.calls[0][0];
    expect(savedNotebook.blocks[0].id).toBe("b2");
    expect(savedNotebook.blocks[1].id).toBe("b1");
  });
});
