// src/infrastructure/services/TextToSpeechService.ts
import * as Speech from "expo-speech";

export class TextToSpeechService {
  public speak(text: string, onEnd?: () => void): void {
    // Cancela qualquer fala anterior para não encavalar as vozes
    this.cancel();

    Speech.speak(text, {
      language: "pt-BR",
      rate: 0.9, // Velocidade um pouco mais lenta, ideal para a terceira idade
      pitch: 1.0,
      onDone: () => {
        if (onEnd) onEnd();
      },
    });
  }

  public cancel(): void {
    Speech.stop();
  }
}
