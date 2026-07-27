import { render, screen } from "@testing-library/react-native";
import { ReminderBlockUI } from "../../../../src/presentation/components/blocks/ReminderBlockUI";

jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: { fontSize: "large" } }),
}));

describe("ReminderBlockUI", () => {
  const mockReminder = {
    id: "101",
    type: "reminder" as const,
    content: "Tomar água",
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  };

  it("deve exibir o conteúdo do lembrete", () => {
    render(
      <ReminderBlockUI
        block={mockReminder}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText("Tomar água")).toBeTruthy();
  });
});
