import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";

export interface HeadingBlockData {
  id: string;
  type: "heading";
  content: string;
}

interface HeadingBlockUIProps {
  block: HeadingBlockData;
  onEdit: () => void;
  onDelete: () => void;
}

export const HeadingBlockUI = ({
  block,
  onEdit,
  onDelete,
}: HeadingBlockUIProps) => {
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
    cardBg: isHighContrast ? "#121212" : "transparent",
    textMain: isHighContrast ? "#FFD700" : "#0056D2", // Títulos têm a cor primária
    danger: isHighContrast ? "#FF6B6B" : "#D93025",
    border: isHighContrast ? "#333333" : "#E0E0E0",
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.cardBg, paddingVertical: 12 * sScale },
      ]}
    >
      <Text
        style={[styles.text, { fontSize: 26 * fScale, color: theme.textMain }]}
      >
        {block.content}
      </Text>

      <View style={[styles.actions, { marginTop: 8 * sScale }]}>
        <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
          <Text
            style={{
              color: theme.textMain,
              fontSize: 16 * fScale,
              fontWeight: "bold",
            }}
          >
            Editar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
          <Text
            style={{
              color: theme.danger,
              fontSize: 16 * fScale,
              fontWeight: "bold",
            }}
          >
            Apagar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  text: { fontWeight: "900" },
  actions: { flexDirection: "row", justifyContent: "flex-start" },
  actionBtn: { paddingVertical: 8, paddingRight: 16 },
});
