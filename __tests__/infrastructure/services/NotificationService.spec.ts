import { Alert } from "react-native";
import { NotificationService } from "../../../src/infrastructure/services/NotificationService";

jest.useFakeTimers();

describe("NotificationService", () => {
  it("deve simular uma notificação chamando o Alert.alert", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");

    await NotificationService.notify("Lembrete", "Tomar água");

    jest.advanceTimersByTime(500);

    expect(alertSpy).toHaveBeenCalledWith("🔔 Lembrete", "Tomar água", [
      { text: "OK", style: "default" },
    ]);

    alertSpy.mockRestore();
  });
});
