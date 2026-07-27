import { render, screen } from "@testing-library/react-native";
import { ReadAloudButton } from "../../../../src/presentation/components/ui/ReadAloudButton";

jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: { fontSize: "large" } }),
}));

describe("ReadAloudButton", () => {
  it("deve renderizar o componente", () => {
    const Props: any = { content: "Olá mundo", text: "Olá mundo" };
    render(<ReadAloudButton {...Props} />);
    expect(screen).toBeDefined();
  });
});
