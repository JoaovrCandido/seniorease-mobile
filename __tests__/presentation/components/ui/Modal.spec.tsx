import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { Modal } from "../../../../src/presentation/components/ui/Modal";

jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: { fontSize: "large" } }),
}));

describe("Modal", () => {
  it("deve exibir os elementos filhos", () => {
    const Props: any = {
      visible: true,
      onClose: jest.fn(),
      animationType: "none",
      transparent: true,
    };
    render(
      <Modal {...Props}>
        <Text>Conteúdo Secreto</Text>
      </Modal>,
    );
    expect(screen.getByText("Conteúdo Secreto")).toBeTruthy();
  });
});
