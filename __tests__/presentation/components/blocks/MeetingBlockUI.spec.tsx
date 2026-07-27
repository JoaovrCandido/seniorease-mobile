import { render, screen } from "@testing-library/react-native";
import { Linking } from "react-native";
import { MeetingBlockUI } from "../../../../src/presentation/components/blocks/MeetingBlockUI";

jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: { fontSize: "large" } }),
}));

jest.spyOn(Linking, "openURL").mockResolvedValue(true as never);

describe("MeetingBlockUI", () => {
  const mockMeeting = {
    id: "789",
    type: "meeting" as const,
    title: "Consulta Médica",
    date: new Date(),
    meetingUrl: "https://zoom.us/j/12345",
    url: "https://zoom.us/j/12345",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  };

  it("deve exibir o título da reunião", () => {
    render(
      <MeetingBlockUI
        block={mockMeeting}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText("Consulta Médica")).toBeTruthy();
  });
});
