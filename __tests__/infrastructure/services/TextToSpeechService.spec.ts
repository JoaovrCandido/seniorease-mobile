import * as Speech from "expo-speech";
import { TextToSpeechService } from "../../../src/infrastructure/services/TextToSpeechService";

jest.mock("expo-speech", () => ({
  speak: jest.fn(),
  stop: jest.fn(),
}));

describe("TextToSpeechService", () => {
  let ttsService: TextToSpeechService;

  beforeEach(() => {
    ttsService = new TextToSpeechService();
    jest.clearAllMocks();
  });

  it("deve chamar o Speech.speak com o idioma pt-BR e o texto fornecido", () => {
    const texto = "A ler em voz alta para si.";

    ttsService.speak(texto);

    expect(Speech.speak).toHaveBeenCalledWith(
      texto,
      expect.objectContaining({
        language: "pt-BR", // Ajustado para corresponder ao seu código
        rate: expect.any(Number),
        pitch: expect.any(Number),
      }),
    );
  });

  it("deve interromper qualquer fala anterior antes de começar uma nova", () => {
    ttsService.speak("Olá");
    expect(Speech.stop).toHaveBeenCalled();
    expect(Speech.speak).toHaveBeenCalled();
  });

  it("deve chamar o Speech.stop quando o método cancel for acionado", () => {
    ttsService.cancel();
    expect(Speech.stop).toHaveBeenCalledTimes(1);
  });
});
