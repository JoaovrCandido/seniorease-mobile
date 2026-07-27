import { render, screen } from "@testing-library/react-native";
import { Button } from "../../../../src/presentation/components/ui/Button";

jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: { fontSize: "large" } }),
}));

describe("Button", () => {
  it("deve renderizar o título", () => {
    render(<Button title="Clique Aqui" onPress={jest.fn()} />);

    expect(screen.getByText("Clique Aqui")).toBeTruthy();
  });
});
