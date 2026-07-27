import { render, screen } from "@testing-library/react-native";
import { TaskBlockUI } from "../../../../src/presentation/components/blocks/TaskBlockUI";

jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: { fontSize: "large" } }),
}));

describe("TaskBlockUI", () => {
  const mockTask = {
    id: "456",
    type: "task" as const,
    content: "Ir à farmácia",
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  };

  it("deve exibir o texto da tarefa", () => {
    render(
      <TaskBlockUI
        block={mockTask}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText("Ir à farmácia")).toBeTruthy();
  });
});
