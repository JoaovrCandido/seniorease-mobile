import { render, screen } from "@testing-library/react-native";
import { DictationButton } from "../../../../src/presentation/components/ui/DictationButton";

jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: { fontSize: "large" } }),
}));

describe("DictationButton", () => {
  it("deve renderizar o componente", () => {
    const Props: any = {
      isListening: false,
      onPress: jest.fn(),
      onStart: jest.fn(),
      onStop: jest.fn(),
    };
    render(<DictationButton {...Props} />);
    expect(screen).toBeDefined();
  });
});
