import { fireEvent, render } from "@testing-library/react-native";
import { DictationButton } from "../../../../src/presentation/components/ui/DictationButton";

describe("DictationButton", () => {
  it("deve chamar a ação ao ser pressionado", () => {
    const mockPress = jest.fn();

    // O seu botão deve ter algum texto ou ícone reconhecível. Supondo que tenha "🎙️" ou "Falar"
    const { getByText } = render(
      (<DictationButton isListening={false} onPress={mockPress} />) as any,
    );

    // Ajuste o emoji se for diferente no seu componente
    fireEvent.press(getByText("🎙️"));
    expect(mockPress).toHaveBeenCalled();
  });
});
