// src/presentation/components/blocks/ReminderBlockUI.tsx
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";

export interface ReminderBlockData {
  id: string;
  type: "reminder";
  content: string;
  date: Date;
}

interface ReminderBlockUIProps {
  block: ReminderBlockData;
  onEdit: () => void;
  onDelete: () => void;
}

export const ReminderBlockUI = ({
  block,
  onEdit,
  onDelete,
}: ReminderBlockUIProps) => {
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
    cardBg: isHighContrast ? "#1E1E1E" : "#FFF9E6", // Fundo levemente amarelo/destaque
    textMain: isHighContrast ? "#FFFFFF" : "#1A1A1A",
    textSub: isHighContrast ? "#BBBBBB" : "#666666",
    primary: isHighContrast ? "#FFD700" : "#E6A23C", // Cor de alerta/lembrete
    danger: isHighContrast ? "#FF6B6B" : "#D93025",
    border: isHighContrast ? "#333333" : "#F3D19E",
  };

  const formattedDate = new Date(block.date).toLocaleDateString("pt-BR");

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
      <View style={styles.header}>
        <Text style={{ fontSize: 24 * fScale }}>⏰</Text>
        <Text
          style={[
            styles.dateText,
            { fontSize: 18 * fScale, color: theme.primary },
          ]}
        >
          Para: {formattedDate}
        </Text>
      </View>

      <Text
        style={[
          styles.text,
          {
            fontSize: 20 * fScale,
            color: theme.textMain,
            marginVertical: 12 * sScale,
          },
        ]}
      >
        {block.content}
      </Text>

      <View
        style={[
          styles.actions,
          {
            marginTop: 8 * sScale,
            paddingTop: 16 * sScale,
            borderTopColor: theme.border,
          },
        ]}
      >
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
  card: { borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  dateText: { fontWeight: "bold", marginLeft: 8 },
  text: { lineHeight: 28, fontWeight: "500" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
  },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 16, marginLeft: 8 },
});
