import * as Speech from "expo-speech";

export class TextToSpeechService {
  speak(text: string): void {
    // Para qualquer fala anterior antes de iniciar uma nova
    this.cancel();

    Speech.speak(text, {
      language: "pt-BR",
      rate: 0.9, // Velocidade otimizada para idosos
      pitch: 1.0,
    });
  }

  cancel(): void {
    Speech.stop();
  }
}
