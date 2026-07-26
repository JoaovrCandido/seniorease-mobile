// src/presentation/hooks/useNotifications.ts
import * as Notifications from "expo-notifications";
import { useCallback } from "react";

export const useNotifications = () => {
  const scheduleNotification = useCallback(
    async (title: string, body: string, date: Date): Promise<string> => {
      // Se a data já passou, dispara imediatamente. Se for no futuro, agenda.
      const trigger = date.getTime() > Date.now() ? date : null;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger,
      });

      return notificationId;
    },
    [],
  );

  const cancelNotification = useCallback(
    async (notificationId: string): Promise<void> => {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    },
    [],
  );

  const cancelAllNotifications = useCallback(async (): Promise<void> => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }, []);

  return { scheduleNotification, cancelNotification, cancelAllNotifications };
};
