import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";

const EMOJIS = [
  "📘",
  "💊",
  "🛒",
  "📞",
  "💡",
  "💰",
  "📅",
  "❤️",
  "🎓",
  "✈️",
  "🐶",
  "🔑",
];

interface EmojiPickerProps {
  selectedEmoji: string;
  onSelect: (emoji: string) => void;
}

export const EmojiPicker = ({ selectedEmoji, onSelect }: EmojiPickerProps) => {
  const { settings } = useAccessibility();
  const fScale =
    settings.fontSize === "extra-large"
      ? 1.4
      : settings.fontSize === "large"
        ? 1.2
        : 1;
  const isHighContrast = settings.highContrast;

  const theme = {
    selectedBg: isHighContrast ? "#FFD700" : "#E8F0FE",
    selectedBorder: isHighContrast ? "#FFD700" : "#0056D2",
    idleBg: isHighContrast ? "#333333" : "#F4F6F8",
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {EMOJIS.map((emoji) => {
          const isSelected = emoji === selectedEmoji;
          return (
            <TouchableOpacity
              key={emoji}
              style={[
                styles.emojiBtn,
                {
                  backgroundColor: isSelected ? theme.selectedBg : theme.idleBg,
                  borderColor: isSelected
                    ? theme.selectedBorder
                    : "transparent",
                },
              ]}
              onPress={() => onSelect(emoji)}
              accessibilityLabel={`Selecionar ícone ${emoji}`}
            >
              <Text style={{ fontSize: 32 * fScale }}>{emoji}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  emojiBtn: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
