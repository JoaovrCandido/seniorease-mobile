import { render, screen } from "@testing-library/react-native";
import { HeadingBlockUI } from "../../../../src/presentation/components/blocks/HeadingBlockUI";

jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: { fontSize: "large" } }),
}));

describe("HeadingBlockUI", () => {
  const mockHeading = {
    id: "202",
    type: "heading" as const,
    content: "Meu Título",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  };

  it("deve renderizar o título em destaque", () => {
    render(
      <HeadingBlockUI
        block={mockHeading}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText("Meu Título")).toBeTruthy();
  });
});
