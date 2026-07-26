// src/presentation/components/blocks/ParagraphBlockUI.tsx
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";

export interface ParagraphBlockData {
  id: string;
  type: "paragraph";
  content: string;
}

interface ParagraphBlockUIProps {
  block: ParagraphBlockData;
  onEdit: () => void;
  onDelete: () => void;
}

export const ParagraphBlockUI = ({
  block,
  onEdit,
  onDelete,
}: ParagraphBlockUIProps) => {
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
    cardBg: isHighContrast ? "#1E1E1E" : "#FFFFFF",
    textMain: isHighContrast ? "#FFFFFF" : "#1A1A1A",
    primary: isHighContrast ? "#FFD700" : "#0056D2",
    danger: isHighContrast ? "#FF6B6B" : "#D93025",
    border: isHighContrast ? "#333333" : "#E0E0E0",
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.border,
          padding: 20 * sScale,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: 20 * fScale,
            color: theme.textMain,
            lineHeight: 28 * fScale,
          },
        ]}
      >
        {block.content}
      </Text>

      <View
        style={[
          styles.actions,
          {
            marginTop: 16 * sScale,
            paddingTop: 16 * sScale,
            borderTopColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
          <Text
            style={{
              color: theme.primary,
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
  card: { borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  text: { fontWeight: "400" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
  },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 16, marginLeft: 8 },
});
