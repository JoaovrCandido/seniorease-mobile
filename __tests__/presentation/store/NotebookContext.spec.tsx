import { act, render } from "@testing-library/react-native";
import {
    NotebookProvider,
    useNotebooks,
} from "../../../src/presentation/store/NotebookContext";

// Evita que o contexto tente ler dados reais durante o teste
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue(JSON.stringify([])),
  setItem: jest.fn(),
}));

describe("NotebookContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve inicializar com uma lista vazia de cadernos", async () => {
    let hookResult = {} as ReturnType<typeof useNotebooks>;

    const TestComponent = () => {
      hookResult = useNotebooks();
      return null;
    };

    render(
      <NotebookProvider>
        <TestComponent />
      </NotebookProvider>,
    );

    // Se o seu contexto carregar os cadernos automaticamente no useEffect,
    // garantimos que a promessa resolve usando act
    await act(async () => {
      if (hookResult.loadNotebooks) {
        await hookResult.loadNotebooks();
      }
    });

    expect(Array.isArray(hookResult.notebooks)).toBe(true);
    expect(hookResult.notebooks.length).toBe(0);
  });
});
