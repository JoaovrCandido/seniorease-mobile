import { render, screen } from "@testing-library/react-native";
import { Input } from "../../../../src/presentation/components/ui/Input";

jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: { fontSize: "large" } }),
}));

describe("Input", () => {
  it("deve renderizar o label", () => {
    render(<Input label="Seu Nome" value="" onChangeText={jest.fn()} />);
    expect(screen.getByText("Seu Nome")).toBeTruthy();
  });
});
