import { render } from "@testing-library/react-native";
import { useNotebook } from "../../../src/presentation/hooks/useNotebook";

jest.mock("../../../src/presentation/store/NotebookContext", () => ({
  useNotebooks: () => ({
    notebooks: [{ id: "caderno-1", title: "Meu Caderno", blocks: [] }],
  }),
}));

describe("useNotebook", () => {
  it("deve retornar dados válidos", () => {
    let data: unknown;
    const TestComponent = () => {
      data = useNotebook("caderno-1");
      return null;
    };
    render(<TestComponent />);
    expect(data).toBeDefined();
  });
});
