// src/presentation/hooks/useDictation.ts
import Voice, {
    SpeechErrorEvent,
    SpeechResultsEvent,
} from "@react-native-voice/voice";
import { useCallback, useEffect, useState } from "react";

export const useDictation = (onTextRecognized: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ligações aos eventos nativos do motor de voz
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setIsListening(false);
      setError(e.error?.message || "Não foi possível compreender a voz.");
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      // O motor devolve um array de possibilidades. A primeira [0] é sempre a mais precisa.
      if (e.value && e.value.length > 0) {
        onTextRecognized(e.value[0]);
      }
    };

    // Limpeza de memória quando o ecrã fechar
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onTextRecognized]);

  const startDictation = useCallback(async () => {
    try {
      setError(null);
      // Pode alterar para 'pt-PT' se preferir o sotaque de Portugal
      await Voice.start("pt-BR");
    } catch (err) {
      console.error("Erro ao iniciar voz:", err);
    }
  }, []);

  const stopDictation = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (err) {
      console.error("Erro ao parar voz:", err);
    }
  }, []);

  return { isListening, error, startDictation, stopDictation };
};
