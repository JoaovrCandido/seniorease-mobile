import * as Speech from "expo-speech";

export class TextToSpeechService {
  speak(text: string): void {
    this.cancel();

    Speech.speak(text, {
      language: "pt-BR",
      rate: 0.9,
      pitch: 1.0,
    });
  }

  cancel(): void {
    Speech.stop();
  }
}
