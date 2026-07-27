import { render } from "@testing-library/react-native";
import { useSpeech } from "../../../src/presentation/hooks/useSpeech";

jest.mock("../../../src/infrastructure/services/TextToSpeechService", () => ({
  TextToSpeechService: jest
    .fn()
    .mockImplementation(() => ({ speak: jest.fn(), cancel: jest.fn() })),
}));

describe("useSpeech", () => {
  it("deve expor métodos do motor de voz", () => {
    let data: unknown;
    const TestComponent = () => {
      data = useSpeech();
      return null;
    };
    render(<TestComponent />);
    expect(data).toBeDefined();
  });
});
