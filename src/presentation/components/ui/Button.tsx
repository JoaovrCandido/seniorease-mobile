// src/presentation/components/ui/Button.tsx
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

export const Button = ({
  title,
  variant = "primary",
  isLoading = false,
  style,
  ...rest
}: ButtonProps) => {
  const { settings } = useAccessibility();

  // Multiplicadores de acessibilidade
  const fScale =
    settings.fontSize === "extra-large"
      ? 1.4
      : settings.fontSize === "large"
        ? 1.2
        : 1;
  const isHighContrast = settings.highContrast;

  // Lógica de temas exata da versão Web
  const getVariantStyles = () => {
    if (isHighContrast) {
      if (variant === "primary")
        return { bg: "#FFD700", text: "#000000", border: "#FFD700" };
      if (variant === "danger")
        return { bg: "#FF6B6B", text: "#000000", border: "#FF6B6B" };
      return { bg: "#1E1E1E", text: "#FFFFFF", border: "#FFD700" }; // secondary
    }

    if (variant === "primary")
      return { bg: "#0056D2", text: "#FFFFFF", border: "#0056D2" };
    if (variant === "danger")
      return { bg: "#D93025", text: "#FFFFFF", border: "#D93025" };
    return { bg: "#E8F0FE", text: "#0056D2", border: "#0056D2" }; // secondary
  };

  const colors = getVariantStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.bg, borderColor: colors.border },
        variant === "secondary" && { borderWidth: 2 },
        style,
      ]}
      disabled={isLoading || rest.disabled}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text
          style={[styles.text, { color: colors.text, fontSize: 18 * fScale }]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "bold",
  },
});
