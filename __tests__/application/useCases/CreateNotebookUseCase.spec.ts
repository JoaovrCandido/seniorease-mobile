import { CreateNotebookUseCase } from "../../../src/application/useCases/CreateNotebookUseCase";
import { MockNotebookRepository } from "../../mocks/MockNotebookRepository";

describe("CreateNotebookUseCase", () => {
  it("deve criar um novo caderno com os dados corretos", async () => {
    const repository = new MockNotebookRepository();
    const useCase = new CreateNotebookUseCase(repository);

    const notebook = await useCase.execute(
      "Receitas",
      "Doces e Salgados",
      "🍰",
    );

    expect(notebook.id).toBeDefined();
    expect(notebook.title).toBe("Receitas");
    expect(notebook.icon).toBe("🍰");
    expect(notebook.blocks.length).toBe(0);
    expect(repository.notebooks.length).toBe(1);
  });
});
