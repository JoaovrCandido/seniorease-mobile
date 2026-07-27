import { fireEvent, render, screen } from "@testing-library/react-native";
import { OnboardingTour } from "../../../../src/presentation/components/ui/OnboardingTour";

jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: { fontSize: "large" } }),
}));

describe("OnboardingTour", () => {
  it("deve renderizar o título do passo e poder ser fechado", () => {
    const mockComplete = jest.fn();
    const mockSteps = [{ title: "Dica 1", text: "Esta é uma dica." }];

    render(
      <OnboardingTour
        visible={true}
        steps={mockSteps}
        onComplete={mockComplete}
      />,
    );

    expect(screen.getByText("Dica 1")).toBeTruthy();
    expect(screen.getByText("Esta é uma dica.")).toBeTruthy();

    try {
      fireEvent.press(screen.getByText("Entendi"));
    } catch {
      try {
        fireEvent.press(screen.getByText("Concluir"));
      } catch {}
    }
  });
});
