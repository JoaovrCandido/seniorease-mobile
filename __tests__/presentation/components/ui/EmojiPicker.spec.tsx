import { fireEvent, render } from "@testing-library/react-native";
import { EmojiPicker } from "../../../../src/presentation/components/ui/EmojiPicker";

describe("EmojiPicker", () => {
  it("deve acionar a função onSelect com o emoji escolhido", () => {
    const mockSelect = jest.fn();
    const { getByText } = render(
      <EmojiPicker selectedEmoji="" onSelect={mockSelect} />,
    );

    // Assumindo que o emoji do caderno azul seja uma das opções renderizadas
    const emojiButton = getByText("📘");
    fireEvent.press(emojiButton);

    expect(mockSelect).toHaveBeenCalledWith("📘");
  });
});
