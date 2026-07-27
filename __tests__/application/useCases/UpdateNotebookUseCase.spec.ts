import { UpdateNotebookUseCase } from "../../../src/application/useCases/UpdateNotebookUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("UpdateNotebookUseCase", () => {
  it("deve atualizar o título, descrição e ícone de um caderno existente", async () => {
    const repository = new MockNotebookRepository();
    repository.notebooks.push({
      id: "caderno-1",
      title: "Título Antigo",
      description: "Desc antiga",
      icon: "📘",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      blocks: [],
    });

    const useCase = new UpdateNotebookUseCase(repository);
    await useCase.execute("caderno-1", "Novo Título", "Nova Desc", "🚀");

    const notebook = await repository.getById("caderno-1");
    expect(notebook?.title).toBe("Novo Título");
    expect(notebook?.description).toBe("Nova Desc");
    expect(notebook?.icon).toBe("🚀");
  });
});
