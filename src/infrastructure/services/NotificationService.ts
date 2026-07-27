import { Alert } from "react-native";

export class NotificationService {
  /**
   * Simula uma notificação local.
   * Como o Expo Go (SDK 53+) removeu o suporte a notificações push nativas,
   * utilizamos um Alert do sistema para garantir compatibilidade universal.
   */
  static async notify(title: string, body: string): Promise<void> {
    // Um pequeno delay para simular o comportamento assíncrono de uma notificação
    setTimeout(() => {
      Alert.alert(`🔔 ${title}`, body, [{ text: "OK", style: "default" }]);
    }, 500);
  }
}
