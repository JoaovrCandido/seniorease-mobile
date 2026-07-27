import { render } from "@testing-library/react-native";
import { ParagraphBlockUI } from "../../../../src/presentation/components/blocks/ParagraphBlockUI";

jest.mock("../../../../src/presentation/store/AccessibilityContext", () => ({
  useAccessibility: () => ({ settings: { fontSize: "large" } }),
}));

describe("ParagraphBlockUI", () => {
  const mockBlock = {
    id: "123",
    type: "paragraph" as const,
    content: "Texto de teste",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("deve renderizar o conteúdo do texto corretamente", () => {
    const { getByText } = render(
      <ParagraphBlockUI
        block={mockBlock}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(getByText("Texto de teste")).toBeTruthy();
  });
});
