// src/presentation/components/blocks/MeetingBlockUI.tsx
import {
    Alert,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";
import { Button } from "../ui/Button";

export interface MeetingBlockData {
  id: string;
  type: "meeting";
  title: string;
  url: string;
  date: Date;
}

interface MeetingBlockUIProps {
  block: MeetingBlockData;
  onEdit: () => void;
  onDelete: () => void;
}

export const MeetingBlockUI = ({
  block,
  onEdit,
  onDelete,
}: MeetingBlockUIProps) => {
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
    cardBg: isHighContrast ? "#1E1E1E" : "#F4F6F8",
    textMain: isHighContrast ? "#FFFFFF" : "#1A1A1A",
    textSub: isHighContrast ? "#BBBBBB" : "#666666",
    primary: isHighContrast ? "#FFD700" : "#0056D2",
    danger: isHighContrast ? "#FF6B6B" : "#D93025",
    border: isHighContrast ? "#333333" : "#E0E0E0",
  };

  const formattedDate = new Date(block.date).toLocaleDateString("pt-BR");

  const handleOpenLink = async () => {
    try {
      const supported = await Linking.canOpenURL(block.url);
      if (supported) {
        await Linking.openURL(block.url);
      } else {
        Alert.alert("Erro", "Não foi possível abrir o link desta reunião.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um problema ao tentar abrir o link.");
    }
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
      <View style={styles.header}>
        <Text style={{ fontSize: 24 * fScale }}>📹</Text>
        <Text
          style={[
            styles.dateText,
            { fontSize: 16 * fScale, color: theme.textSub },
          ]}
        >
          {formattedDate}
        </Text>
      </View>

      <Text
        style={[
          styles.title,
          {
            fontSize: 22 * fScale,
            color: theme.textMain,
            marginVertical: 12 * sScale,
          },
        ]}
      >
        {block.title}
      </Text>

      {/* Utilizando o nosso Button genérico recém-criado */}
      <Button
        title="Entrar na Reunião"
        onPress={handleOpenLink}
        style={{ marginVertical: 12 * sScale }}
      />

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: { fontWeight: "bold" },
  title: { fontWeight: "bold" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
  },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 16, marginLeft: 8 },
});
