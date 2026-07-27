import { render } from "@testing-library/react-native";
import { useNotifications } from "../../../src/presentation/hooks/useNotifications";

jest.mock("expo-notifications", () => ({}));
jest.mock("../../../src/infrastructure/services/NotificationService", () => ({
  NotificationService: { notify: jest.fn() },
}));

describe("useNotifications", () => {
  it("deve montar o hook sem erros", () => {
    let data: unknown;
    const TestComponent = () => {
      data = useNotifications();
      return null;
    };
    render(<TestComponent />);
    expect(data).toBeDefined();
  });
});
