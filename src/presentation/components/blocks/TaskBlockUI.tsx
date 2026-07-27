import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";

export interface TaskBlockData {
  id: string;
  type: "task";
  content: string;
  isCompleted: boolean;
}

interface TaskBlockUIProps {
  block: TaskBlockData;
  onToggle: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskBlockUI = ({
  block,
  onToggle,
  onEdit,
  onDelete,
}: TaskBlockUIProps) => {
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
    textMain: block.isCompleted
      ? isHighContrast
        ? "#888888"
        : "#9CA3AF"
      : isHighContrast
        ? "#FFFFFF"
        : "#1A1A1A",
    success: isHighContrast ? "#4ADE80" : "#137333",
    primary: isHighContrast ? "#FFD700" : "#0056D2",
    danger: isHighContrast ? "#FF6B6B" : "#D93025",
    border: isHighContrast ? "#333333" : "#E5E7EB",
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
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            {
              width: 32 * fScale,
              height: 32 * fScale,
              borderColor: block.isCompleted ? theme.success : theme.primary,
              backgroundColor: block.isCompleted
                ? theme.success
                : "transparent",
            },
          ]}
          onPress={() => onToggle(block.id)}
          accessibilityLabel={
            block.isCompleted
              ? "Marcar como não concluída"
              : "Marcar como concluída"
          }
        >
          {block.isCompleted && (
            <Text
              style={{
                color: "#FFF",
                fontSize: 20 * fScale,
                fontWeight: "bold",
              }}
            >
              ✓
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.content}>
          <Text
            style={[
              styles.text,
              {
                fontSize: 20 * fScale,
                color: theme.textMain,
                textDecorationLine: block.isCompleted ? "line-through" : "none",
              },
            ]}
          >
            {block.content}
          </Text>
        </View>
      </View>

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
  row: { flexDirection: "row", alignItems: "flex-start" },
  checkbox: {
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    marginTop: 2,
  },
  content: { flex: 1 },
  text: { lineHeight: 28 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
  },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 16, marginLeft: 8 },
});
