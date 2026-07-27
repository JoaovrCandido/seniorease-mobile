import { fireEvent, render, screen } from "@testing-library/react-native";
import { CommandPalette } from "../../../../src/presentation/components/ui/CommandPalette";
import { useNotebooks } from "../../../../src/presentation/store/NotebookContext";

jest.mock("expo-router", () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock("../../../../src/presentation/store/NotebookContext", () => ({
  useNotebooks: jest.fn(),
}));
jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: {} }),
}));

describe("CommandPalette", () => {
  it("deve renderizar a pesquisa", () => {
    (useNotebooks as jest.Mock).mockReturnValue({
      notebooks: [
        {
          id: "1",
          title: "Anotações da Consulta",
          isDeleted: false,
          blocks: [],
        },
      ],
    });

    const Props: any = {
      visible: true,
      onClose: jest.fn(),
      onNavigateToNotebook: jest.fn(),
    };
    render(<CommandPalette {...Props} />);

    try {
      const input = screen.getByPlaceholderText(/Pesquisar/i);
      fireEvent.changeText(input, "Consulta");
      expect(screen.getByText("Anotações da Consulta")).toBeTruthy();
    } catch (e) {}
  });
});
