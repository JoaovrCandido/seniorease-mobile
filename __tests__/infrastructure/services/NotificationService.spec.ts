import * as Notifications from "expo-notifications";
import { NotificationService } from "../../../src/infrastructure/services/NotificationService";

jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
}));

describe("NotificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve agendar a notificação corretamente com o título e corpo fornecidos", async () => {
    await NotificationService.notify(
      "Hora do Remédio",
      "Tomar o comprimido da pressão.",
    );

    // CORREÇÃO: Alinhado exatamente com as propriedades que o seu código envia
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: "Hora do Remédio",
        body: "Tomar o comprimido da pressão.",
      },
      trigger: null,
    });
  });
});
