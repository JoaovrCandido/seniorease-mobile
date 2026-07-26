// src/presentation/hooks/useDictation.ts
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice";
import { useCallback, useEffect, useState } from "react";

export const useDictation = (onTextRecognized: (text: string) => void) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onTextRecognized]);

  const startDictation = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await Voice.start("pt-BR");
    } catch (err) {
      console.error("Erro ao iniciar ditação:", err);
    }
  }, []);

  const stopDictation = useCallback(async (): Promise<void> => {
    try {
      await Voice.stop();
    } catch (err) {
      console.error("Erro ao parar ditação:", err);
    }
  }, []);

  return { isListening, error, startDictation, stopDictation };
};
