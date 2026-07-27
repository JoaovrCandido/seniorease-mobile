import { render } from "@testing-library/react-native";
import { MeetingBlockUI } from "../../../../src/presentation/components/blocks/MeetingBlockUI";

jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: { fontSize: "large" } }),
}));

describe("MeetingBlockUI", () => {
  const mockMeeting = {
    id: "789",
    type: "meeting" as const,
    title: "Consulta Médica",
    date: new Date(),
    meetingUrl: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  };

  it("deve exibir o título da reunião", () => {
    const { getByText } = render(
      <MeetingBlockUI
        block={mockMeeting}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(getByText("Consulta Médica")).toBeTruthy();
  });
});
