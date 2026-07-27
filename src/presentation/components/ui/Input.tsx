import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, style, ...rest }: InputProps) => {
  const { settings } = useAccessibility();

  const fScale =
    settings.fontSize === "extra-large"
      ? 1.4
      : settings.fontSize === "large"
        ? 1.2
        : 1;
  const sScale = settings.spacing === "comfortable" ? 1.5 : 1;
  const isHighContrast = settings.highContrast;

  const theme = {
    bg: isHighContrast ? "#121212" : "#F9FAFB",
    text: isHighContrast ? "#FFFFFF" : "#1A1A1A",
    border: error
      ? isHighContrast
        ? "#FF6B6B"
        : "#D93025"
      : isHighContrast
        ? "#333333"
        : "#E5E7EB",
    placeholder: isHighContrast ? "#888888" : "#9CA3AF",
    label: isHighContrast ? "#FFFFFF" : "#333333",
  };

  return (
    <View style={[styles.container, { marginBottom: 16 * sScale }]}>
      {label && (
        <Text
          style={[styles.label, { color: theme.label, fontSize: 16 * fScale }]}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.bg,
            color: theme.text,
            borderColor: theme.border,
            fontSize: 18 * fScale,
            padding: 16 * sScale,
          },
          style,
        ]}
        placeholderTextColor={theme.placeholder}
        {...rest}
      />
      {error && (
        <Text style={[styles.error, { fontSize: 14 * fScale }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
  },
  error: {
    color: "#D93025",
    marginTop: 4,
    fontWeight: "500",
  },
});
