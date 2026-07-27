import { AddBlockUseCase } from "../../../src/application/useCases/AddBlockUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("AddBlockUseCase", () => {
  it("deve adicionar um bloco ao caderno", async () => {
    const repo = new MockNotebookRepository();
    repo.getById = jest.fn().mockResolvedValue({
      id: "1",
      title: "Caderno",
      icon: "📘",
      blocks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });
    repo.save = jest.fn();

    const useCase = new AddBlockUseCase(repo);
    await useCase.execute("1", "Comprar pão", "paragraph");

    expect(repo.save).toHaveBeenCalled();
    const savedNotebook = (repo.save as jest.Mock).mock.calls[0][0];

    expect((savedNotebook.blocks[0] as any).content).toBe("Comprar pão");
  });
});
