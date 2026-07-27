import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

const isExpoGo = Constants.appOwnership === "expo";

try {
  if (!isExpoGo) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
} catch (error) {
  console.warn("Configuração de notificações ignorada no ambiente atual.");
}

export class NotificationService {
  static async notify(title: string, body: string) {
    if (isExpoGo) {
      console.log(`\n🔔 [NOTIFICAÇÃO SIMULADA - EXPO GO]`);
      console.log(`Título: ${title}`);
      console.log(`Mensagem: ${body}\n`);
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Erro ao disparar notificação:", error);
    }
  }
}
