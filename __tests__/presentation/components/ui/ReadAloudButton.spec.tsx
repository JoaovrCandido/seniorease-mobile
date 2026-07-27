import { fireEvent, render } from "@testing-library/react-native";
import { ReadAloudButton } from "../../../../src/presentation/components/ui/ReadAloudButton";

// Mock do TextToSpeechService se o componente instanciar diretamente
jest.mock("../../../../src/infrastructure/services/TextToSpeechService", () => {
  return {
    TextToSpeechService: jest.fn().mockImplementation(() => ({
      speak: jest.fn(),
      cancel: jest.fn(),
    })),
  };
});

describe("ReadAloudButton", () => {
  it("deve renderizar e reagir ao toque", () => {
    const { getByText } = render((<ReadAloudButton text="Olá mundo" />) as any);

    // Ajuste caso o ícone seja outro (ex: 🔊)
    const button = getByText("🔊");
    expect(button).toBeTruthy();

    fireEvent.press(button);
  });
});
