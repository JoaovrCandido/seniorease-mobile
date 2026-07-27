import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { Modal } from "../../../../src/presentation/components/ui/Modal";

describe("Modal", () => {
  it("deve exibir os elementos filhos quando estiver visível", () => {
    // Usamos any temporariamente no teste apenas para evitar erros de props customizadas que não conheço
    const { getByText } = render(
      (
        <Modal
          visible={true}
          onRequestClose={jest.fn()}
          animationType="none"
          transparent={true}
        >
          <Text>Conteúdo Secreto</Text>
        </Modal>
      ) as any,
    );

    expect(getByText("Conteúdo Secreto")).toBeTruthy();
  });
});
