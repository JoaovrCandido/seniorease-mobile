// src/presentation/hooks/useSpeech.ts
import * as Speech from "expo-speech";
import { useCallback, useEffect, useState } from "react";

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const speak = useCallback((text: string) => {
    // Cancela qualquer fala anterior antes de começar uma nova
    Speech.stop();

    Speech.speak(text, {
      language: "pt-BR", // Garante o sotaque correto
      rate: 0.9, // Ligeiramente mais lento para o público idoso
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, []);

  const stop = useCallback(() => {
    Speech.stop();
    setIsSpeaking(false);
  }, []);

  // Garante que a voz para se o utilizador sair do ecrã
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  return { speak, stop, isSpeaking };
};
