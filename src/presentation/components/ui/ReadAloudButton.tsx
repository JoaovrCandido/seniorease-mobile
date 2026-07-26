import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";

interface ReadAloudButtonProps {
  onPress: () => void;
  isSpeaking: boolean;
}

export const ReadAloudButton = ({
  onPress,
  isSpeaking,
}: ReadAloudButtonProps) => {
  const { settings } = useAccessibility();
  const fScale =
    settings.fontSize === "extra-large"
      ? 1.4
      : settings.fontSize === "large"
        ? 1.2
        : 1;
  const isHighContrast = settings.highContrast;

  const theme = {
    bg: isHighContrast ? "#133320" : "#E6F4EA",
    text: isHighContrast ? "#4ADE80" : "#137333",
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.bg }]}
      onPress={onPress}
      accessibilityLabel="Ler caderno em voz alta"
    >
      <Text style={[styles.text, { fontSize: 16 * fScale, color: theme.text }]}>
        {isSpeaking ? "⏹️ Parar" : "🔊 Ouvir"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontWeight: "bold" },
});
