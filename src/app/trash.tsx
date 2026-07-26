// src/app/trash.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../presentation/components/ui/Button";
import { OnboardingTour } from "../presentation/components/ui/OnboardingTour";
import { useAccessibility } from "../presentation/store/AccessibilityContext";
import { useNotebooks } from "../presentation/store/NotebookContext";
import { useToast } from "../presentation/store/ToastContext";
import { useUserProfile } from "../presentation/store/UserProfileContext";

// Tipo unificado para misturarmos cadernos e anotações na mesma lista
type TrashItem = {
  id: string;
  type: "notebook" | "block";
  icon: string;
  title: string;
  subtitle: string;
  notebookId?: string; // Usado apenas quando for um bloco
};

const getSafeText = (rawContent: any): string => {
  if (typeof rawContent === "string") return rawContent;
  if (rawContent && typeof rawContent === "object") {
    return rawContent.content || rawContent.title || JSON.stringify(rawContent);
  }
  return String(rawContent || "Anotação sem título");
};

const getBlockIcon = (type: string) => {
  switch (type) {
    case "task":
      return "✅";
    case "reminder":
      return "⏰";
    case "meeting":
      return "📹";
    default:
      return "📝";
  }
};

export default function TrashScreen() {
  const router = useRouter();
  const {
    notebooks,
    restoreNotebook,
    hardDeleteNotebook,
    restoreBlock,
    hardDeleteBlock,
  } = useNotebooks();
  const { settings } = useAccessibility();
  const { profile } = useUserProfile();
  const { showToast } = useToast();
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  const fScale =
    settings.fontSize === "extra-large"
      ? 1.4
      : settings.fontSize === "large"
        ? 1.2
        : 1;
  const sScale = settings.spacing === "comfortable" ? 1.5 : 1;
  const isHighContrast = settings.highContrast;

  const theme = {
    bg: isHighContrast ? "#121212" : "#F4F6F8",
    card: isHighContrast ? "#1E1E1E" : "#FFFFFF",
    textMain: isHighContrast ? "#FFFFFF" : "#1A1A1A",
    textSub: isHighContrast ? "#BBBBBB" : "#666666",
    border: isHighContrast ? "#333333" : "#E0E0E0",
    primary: isHighContrast ? "#FFD700" : "#0056D2",
    danger: isHighContrast ? "#FF6B6B" : "#D93025",
  };

  // Junta todos os cadernos apagados E as anotações apagadas (apenas de cadernos ativos)
  const trashItems: TrashItem[] = [
    ...notebooks
      .filter((n) => n.isDeleted)
      .map((n) => ({
        id: n.id,
        type: "notebook" as const,
        icon: n.icon || "📘",
        title: n.title,
        subtitle: "Caderno completo apagado",
      })),
    ...notebooks
      .filter((n) => !n.isDeleted)
      .flatMap((n) =>
        n.blocks
          .filter((b) => b.isDeleted)
          .map((b) => ({
            id: b.id,
            type: "block" as const,
            icon: getBlockIcon(b.type),
            title: getSafeText(b.content),
            subtitle: `Anotação de: ${n.title}`,
            notebookId: n.id,
          })),
      ),
  ];

  const handleRestore = async (item: TrashItem) => {
    try {
      if (item.type === "notebook") {
        await restoreNotebook(item.id);
      } else {
        await restoreBlock(item.notebookId!, item.id);
      }

      // NOVO: Mensagem de incentivo ao restaurar da lixeira
      const msg = settings.encouragement
        ? PraiseService.getRandomPraise("restore", profile.preferredName)
        : "Restaurado com sucesso!";

      showToast(msg, "success");
    } catch (error) {
      showToast(`Erro ao restaurar.`, "error");
    }
  };

  const handleHardDelete = (item: TrashItem) => {
    Alert.alert(
      "Apagar Definitivamente",
      `Tem a certeza que deseja apagar "${item.title}" para sempre?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, apagar de vez",
          style: "destructive",
          onPress: async () => {
            try {
              if (item.type === "notebook") {
                await hardDeleteNotebook(item.id);
              } else {
                await hardDeleteBlock(item.notebookId!, item.id);
              }
              showToast("Apagado permanentemente.", "info");
            } catch (error) {
              showToast("Erro ao apagar.", "error");
            }
          },
        },
      ],
    );
  };

  const firstName = profile.preferredName
    ? profile.preferredName.trim().split(" ")[0]
    : "";
  const trashSteps = [
    {
      title: `Lixeira${firstName ? ` de ${firstName}` : ""}`,
      text: "Tudo o que apaga vem parar aqui. Funciona como uma rede de segurança para não perder nada por acidente.",
    },
    {
      title: "Restaurar",
      text: "Tocou em apagar sem querer? Não há problema! Pressione 'Restaurar' e o item volta exatamente para onde estava.",
    },
    {
      title: "Apagar Definitivamente",
      text: "Para limpar espaço, pode escolher 'Apagar de vez'. Cuidado, esta ação não pode ser desfeita!",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.card,
            borderBottomColor: theme.border,
            paddingBottom: 16 * sScale,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text
            style={{
              fontSize: 16 * fScale,
              color: theme.primary,
              fontWeight: "bold",
            }}
          >
            ← Voltar
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            fontSize: 24 * fScale,
            fontWeight: "bold",
            color: theme.textMain,
          }}
        >
          Lixeira
        </Text>

        {!settings.advancedMode && (
          <TouchableOpacity
            onPress={() => setIsHelpVisible(true)}
            style={{ padding: 8 }}
          >
            <Text style={{ fontSize: 24 * fScale }}>❓</Text>
          </TouchableOpacity>
        )}
      </View>

      <OnboardingTour
        visible={isHelpVisible}
        onComplete={() => setIsHelpVisible(false)}
        steps={trashSteps}
      />

      <FlatList
        data={trashItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 * sScale }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={{ fontSize: 32 * fScale, marginRight: 12 }}>
                {item.icon}
              </Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.title,
                    { fontSize: 20 * fScale, color: theme.textMain },
                  ]}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14 * fScale,
                    color: theme.textSub,
                    marginTop: 4,
                  }}
                >
                  {item.subtitle}
                </Text>
              </View>
            </View>

            <View style={[styles.actionRow, { marginTop: 16 * sScale }]}>
              <Button
                title="Restaurar"
                onPress={() => handleRestore(item)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="Apagar de vez"
                variant="danger"
                onPress={() => handleHardDelete(item)}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48 * fScale, marginBottom: 16 }}>🗑️</Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 18 * fScale,
                color: theme.textSub,
              }}
            >
              A sua lixeira está vazia.{"\n"}Os itens que apagar virão para
              aqui.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: { padding: 8, marginRight: 8 },
  card: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  title: { fontWeight: "bold" },
  actionRow: { flexDirection: "row", justifyContent: "space-between" },
  emptyContainer: { alignItems: "center", marginTop: 60 },
});
