// src/infrastructure/services/NotificationService.ts
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

// 1. Verificamos se estamos a usar a app de testes "Expo Go"
const isExpoGo = Constants.appOwnership === "expo";

// 2. Protegemos a configuração num bloco try/catch e isolamos do Expo Go
try {
  if (!isExpoGo) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true, // <-- Adicione esta propriedade
        shouldShowList: true,
      }),
    });
  }
} catch (error) {
  console.warn("Configuração de notificações ignorada no ambiente atual.");
}

export class NotificationService {
  static async notify(title: string, body: string) {
    // Se estivermos no Expo Go, simulamos no terminal para não quebrar a app
    if (isExpoGo) {
      console.log(`\n🔔 [NOTIFICAÇÃO SIMULADA - EXPO GO]`);
      console.log(`Título: ${title}`);
      console.log(`Mensagem: ${body}\n`);
      return;
    }

    // Se for a aplicação real (APK/Development Build), dispara a notificação nativa
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
        },
        trigger: null, // null faz a notificação disparar imediatamente
      });
    } catch (error) {
      console.error("Erro ao disparar notificação:", error);
    }
  }
}
