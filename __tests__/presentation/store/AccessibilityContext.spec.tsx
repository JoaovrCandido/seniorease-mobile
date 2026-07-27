import { render } from "@testing-library/react-native";
import {
  AccessibilityProvider,
  useAccessibility,
} from "../../../src/presentation/store/AccessibilityContext";

describe("AccessibilityContext", () => {
  it("deve inicializar o contexto", () => {
    let accessData: unknown;
    const TestComponent = () => {
      accessData = useAccessibility();
      return null;
    };
    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>,
    );
    expect(accessData).toBeDefined();
  });
});
