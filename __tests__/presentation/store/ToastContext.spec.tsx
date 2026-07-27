import { render } from "@testing-library/react-native";
import {
  ToastProvider,
  useToast,
} from "../../../src/presentation/store/ToastContext";

describe("ToastContext", () => {
  it("deve inicializar o toast", () => {
    let toastData: unknown;
    const TestComponent = () => {
      toastData = useToast();
      return null;
    };
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );
    expect(toastData).toBeDefined();
  });
});
