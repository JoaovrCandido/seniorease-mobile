import { act, render } from "@testing-library/react-native";
import {
  NotebookProvider,
  useNotebooks,
} from "../../../src/presentation/store/NotebookContext";

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

    await act(async () => {
      if (hookResult.loadNotebooks) {
        await hookResult.loadNotebooks();
      }
    });

    expect(Array.isArray(hookResult.notebooks)).toBe(true);
    expect(hookResult.notebooks.length).toBe(0);
  });
});
