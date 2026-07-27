import { render, screen } from "@testing-library/react-native";
import { Button } from "../../../../src/presentation/components/ui/Button";

// 1. O Mock da Acessibilidade é OBRIGATÓRIO no topo do ficheiro
jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: { fontSize: "large" } }),
}));

describe("Button", () => {
  it("deve renderizar o título", () => {
    // 2. Chame apenas render()
    render(<Button title="Clique Aqui" onPress={jest.fn()} />);

    // 3. Use screen.getByText
    expect(screen.getByText("Clique Aqui")).toBeTruthy();
  });
});
