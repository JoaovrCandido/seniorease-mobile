import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useDictation = (onTextRecognized: (text: string) => void) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (Voice) {
        Voice.onSpeechStart = () => setIsListening(true);
        Voice.onSpeechEnd = () => setIsListening(false);

        Voice.onSpeechError = (e: SpeechErrorEvent) => {
          setIsListening(false);
          setError(e.error?.message || "Erro de compreensão");
        };

        Voice.onSpeechResults = (e: SpeechResultsEvent) => {
          if (e.value && e.value.length > 0) {
            onTextRecognized(e.value[0]);
          }
        };
      }
    } catch (err: unknown) {
      console.warn("Módulo de voz nativo não inicializado:", err);
    }

    return () => {
      try {
        if (Voice && typeof Voice.destroy === "function") {
          Voice.destroy()
            .then(() => Voice.removeAllListeners())
            .catch(() => {});
        }
      } catch (err: unknown) {
        // Ignora erros de limpeza de listener nativo
      }
    };
  }, [onTextRecognized]);

  const startDictation = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      if (Voice && typeof Voice.start === "function") {
        await Voice.start("pt-BR");
      } else {
        Alert.alert(
          "Aviso",
          "O reconhecimento de voz não está disponível neste dispositivo.",
        );
      }
    } catch (err: unknown) {
      console.error("Erro ao iniciar ditação:", err);
      setIsListening(false);
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao aceder ao microfone";
      setError(errorMessage);
      Alert.alert(
        "Microfone Indisponível",
        "Não foi possível iniciar a gravação. Verifique as permissões nas definições.",
      );
    }
  }, []);

  const stopDictation = useCallback(async (): Promise<void> => {
    try {
      if (Voice && typeof Voice.stop === "function") {
        await Voice.stop();
      }
    } catch (err: unknown) {
      console.error("Erro ao parar ditação:", err);
    }
  }, []);

  return { isListening, error, startDictation, stopDictation };
};
