import { render, screen } from "@testing-library/react-native";
import { EmojiPicker } from "../../../../src/presentation/components/ui/EmojiPicker";

jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: { fontSize: "large" } }),
}));

describe("EmojiPicker", () => {
  it("deve renderizar o componente", () => {
    render(<EmojiPicker selectedEmoji="" onSelect={jest.fn()} />);
    expect(screen).toBeDefined();
  });
});
