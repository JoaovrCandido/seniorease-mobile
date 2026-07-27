import { render } from "@testing-library/react-native";
import {
  SettingsProvider,
  useSettings,
} from "../../../src/presentation/store/SettingsContext";

describe("SettingsContext", () => {
  it("deve inicializar as configurações", () => {
    let settingsData: unknown;
    const TestComponent = () => {
      settingsData = useSettings();
      return null;
    };
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>,
    );
    expect(settingsData).toBeDefined();
  });
});
