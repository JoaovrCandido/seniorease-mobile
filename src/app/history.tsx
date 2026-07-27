import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OnboardingTour } from "../presentation/components/ui/OnboardingTour";
import { useAccessibility } from "../presentation/store/AccessibilityContext";
import { useNotebooks } from "../presentation/store/NotebookContext";
import { useUserProfile } from "../presentation/store/UserProfileContext";

export default function HistoryScreen() {
  const router = useRouter();
  const { notebooks } = useNotebooks();
  const { settings } = useAccessibility();
  const { profile } = useUserProfile();
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
  };

  const sortedNotebooks = [...notebooks]
    .filter((n) => !n.isDeleted)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  const firstName = profile.preferredName
    ? profile.preferredName.trim().split(" ")[0]
    : "";

  const historySteps = [
    {
      title: `O seu Histórico${firstName ? `, ${firstName}` : ""}`,
      text: "Não se lembra qual foi o último caderno em que escreveu? Aqui estão todos organizados.",
    },
    {
      title: "Como Funciona",
      text: "Os cadernos que editou mais recentemente aparecem sempre no topo da lista.",
    },
    {
      title: "Acesso Rápido",
      text: "Basta tocar em qualquer caderno desta lista para abri-lo imediatamente.",
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
          Atividade Recente
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
        steps={historySteps}
      />

      <FlatList
        data={sortedNotebooks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 * sScale }}
        renderItem={({ item }) => {
          const date = new Date(item.updatedAt);
          const formattedDate = `${date.toLocaleDateString("pt-BR")} às ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;

          return (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={() => router.push(`/notebook/${item.id}`)}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 32 * fScale, marginRight: 16 }}>
                {item.icon}
              </Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.title,
                    { fontSize: 20 * fScale, color: theme.textMain },
                  ]}
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
                  Última edição: {formattedDate}
                </Text>
              </View>
              <Text style={{ fontSize: 20 * fScale, color: theme.textSub }}>
                ❯
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48 * fScale, marginBottom: 16 }}>⏱️</Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 18 * fScale,
                color: theme.textSub,
              }}
            >
              O seu histórico está vazio.{"\n"}As suas edições recentes
              aparecerão aqui.
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
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  title: { fontWeight: "bold" },
  emptyContainer: { alignItems: "center", marginTop: 60 },
});
