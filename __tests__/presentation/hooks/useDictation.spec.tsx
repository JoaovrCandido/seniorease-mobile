import { render } from "@testing-library/react-native";
import { useDictation } from "../../../src/presentation/hooks/useDictation";

jest.mock("@react-native-voice/voice", () => ({
  start: jest.fn(),
  stop: jest.fn(),
  destroy: jest.fn(),
  removeAllListeners: jest.fn(),
}));

describe("useDictation", () => {
  it("deve inicializar o status de escuta", () => {
    let data: any;
    const TestComponent = () => {
      data = useDictation(jest.fn());
      return null;
    };
    render(<TestComponent />);
    expect(data?.isListening).toBeDefined();
  });
});
