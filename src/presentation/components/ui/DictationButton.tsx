import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";

interface DictationButtonProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const DictationButton = ({
  isListening,
  onStart,
  onStop,
}: DictationButtonProps) => {
  const { settings } = useAccessibility();
  const fScale =
    settings.fontSize === "extra-large"
      ? 1.4
      : settings.fontSize === "large"
        ? 1.2
        : 1;
  const isHighContrast = settings.highContrast;

  const theme = {
    bgIdle: isHighContrast ? "#333333" : "#E8F0FE",
    borderIdle: isHighContrast ? "#FFD700" : "#0056D2",
    bgActive: isHighContrast ? "#331412" : "#FCE8E6",
    borderActive: isHighContrast ? "#FF6B6B" : "#D93025",
    textActive: isHighContrast ? "#FF6B6B" : "#D93025",
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isListening ? theme.bgActive : theme.bgIdle,
            borderColor: isListening ? theme.borderActive : theme.borderIdle,
            transform: [{ scale: isListening ? 1.1 : 1 }],
          },
        ]}
        onPress={isListening ? onStop : onStart}
        accessibilityLabel={
          isListening ? "Parar gravação" : "Ditar em voz alta"
        }
      >
        <Text style={{ fontSize: 32 * fScale }}>
          {isListening ? "🛑" : "🎙️"}
        </Text>
      </TouchableOpacity>

      {isListening && (
        <Text
          style={[
            styles.feedbackText,
            { color: theme.textActive, fontSize: 16 * fScale },
          ]}
        >
          A escutar...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  button: {
    padding: 20,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackText: {
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
});
