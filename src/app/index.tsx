import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../presentation/components/ui/Button";
import { EmojiPicker } from "../presentation/components/ui/EmojiPicker";
import { Input } from "../presentation/components/ui/Input";
import { OnboardingTour } from "../presentation/components/ui/OnboardingTour";
import { useAccessibility } from "../presentation/store/AccessibilityContext";
import { useNotebooks } from "../presentation/store/NotebookContext";
import { useUserProfile } from "../presentation/store/UserProfileContext";

export default function HomeScreen() {
  const router = useRouter();
  const { notebooks, loadNotebooks, createNotebook } = useNotebooks();
  const { settings } = useAccessibility();
  const { profile } = useUserProfile();

  const [isOnboardingVisible, setIsOnboardingVisible] =
    useState<boolean>(false);
  const [isCommandPaletteVisible, setIsCommandPaletteVisible] =
    useState<boolean>(false);

  // NOVOS ESTADOS PARA O MODAL DE CRIAÇÃO
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newNotebookTitle, setNewNotebookTitle] = useState("");
  const [newNotebookDesc, setNewNotebookDesc] = useState("");
  const [newNotebookIcon, setNewNotebookIcon] = useState("📘");

  useEffect(() => {
    loadNotebooks();
  }, []);

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
    primary: isHighContrast ? "#FFD700" : "#0056D2",
    border: isHighContrast ? "#333333" : "#E0E0E0",
  };

  const firstName = profile.preferredName
    ? profile.preferredName.trim().split(" ")[0]
    : "";
  const greeting = firstName ? `Olá, ${firstName}!` : "Bem-vindo!";

  const homeSteps = [
    {
      title: greeting,
      text: "Este é o seu ecrã inicial. Aqui encontra todos os seus cadernos organizados. Toque em qualquer um deles para o abrir.",
    },
    {
      title: "Criar Novos Cadernos",
      text: "Toque no botão grande em baixo '+ Novo Caderno' para criar um espaço novo para as suas anotações.",
    },
    {
      title: "Menu Superior",
      text: "No topo, tem opções para procurar anotações e uma engrenagem (⚙️) para ir ao seu Perfil.",
    },
  ];

  const visibleNotebooks = notebooks.filter((n) => !n.isDeleted);

  // FUNÇÃO PARA GUARDAR O NOVO CADERNO
  const handleCreateNotebook = async () => {
    if (!newNotebookTitle.trim()) {
      alert("Por favor, digite um nome para o caderno.");
      return;
    }

    await createNotebook(newNotebookTitle, newNotebookDesc, newNotebookIcon);

    setNewNotebookTitle("");
    setNewNotebookDesc("");
    setNewNotebookIcon("📘");
    setIsCreateModalVisible(false);
  };

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
        <Text
          style={{
            flex: 1,
            fontSize: 28 * fScale,
            fontWeight: "bold",
            color: theme.textMain,
          }}
        >
          SeniorEase
        </Text>

        <View style={styles.headerActions}>
          {!settings.advancedMode && (
            <TouchableOpacity
              onPress={() => setIsOnboardingVisible(true)}
              style={styles.iconBtn}
            >
              <Text style={{ fontSize: 24 * fScale }}>❓</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setIsCommandPaletteVisible(true)}
            style={styles.iconBtn}
          >
            <Text style={{ fontSize: 24 * fScale }}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            style={styles.iconBtn}
          >
            <Text style={{ fontSize: 24 * fScale }}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <OnboardingTour
        visible={isOnboardingVisible}
        onComplete={() => setIsOnboardingVisible(false)}
        steps={homeSteps}
      />

      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 24 * sScale,
          paddingTop: 24 * sScale,
        }}
      >
        <Button
          title="🕒 Histórico"
          variant="secondary"
          onPress={() => router.push("/history")}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title="🗑️ Lixeira"
          variant="secondary"
          onPress={() => router.push("/trash")}
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>

      <FlatList
        data={visibleNotebooks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 * sScale }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                padding: 24 * sScale,
              },
            ]}
            onPress={() => router.push(`/notebook/${item.id}`)}
          >
            <Text style={{ fontSize: 40 * fScale, marginBottom: 12 * sScale }}>
              {item.icon}
            </Text>
            <Text
              style={{
                fontSize: 22 * fScale,
                fontWeight: "bold",
                color: theme.textMain,
                marginBottom: 8 * sScale,
              }}
            >
              {item.title}
            </Text>
            {item.description ? (
              <Text style={{ fontSize: 16 * fScale, color: theme.textSub }}>
                {item.description}
              </Text>
            ) : null}
          </TouchableOpacity>
        )}
      />

      <View style={styles.fabContainer}>
        <Button
          title="+ Novo Caderno"
          onPress={() => setIsCreateModalVisible(true)}
          style={{ paddingHorizontal: 32 * sScale, borderRadius: 30 }}
        />
      </View>

      {/* MODAL DE CRIAÇÃO AQUI NO FINAL */}
      <Modal
        visible={isCreateModalVisible}
        animationType={settings.reduceMotion ? "none" : "slide"}
        transparent={true}
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "flex-end",
          }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            style={{
              backgroundColor: theme.card,
              padding: 24 * sScale,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
          >
            <Text
              style={{
                fontSize: 24 * fScale,
                fontWeight: "bold",
                color: theme.textMain,
                marginBottom: 20 * sScale,
                textAlign: "center",
              }}
            >
              Novo Caderno
            </Text>

            <EmojiPicker
              selectedEmoji={newNotebookIcon}
              onSelect={setNewNotebookIcon}
            />

            <Input
              label="Nome do Caderno"
              value={newNotebookTitle}
              onChangeText={setNewNotebookTitle}
            />

            <Input
              label="Descrição (Opcional)"
              value={newNotebookDesc}
              onChangeText={setNewNotebookDesc}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 16 * sScale,
              }}
            >
              <Button
                title="Cancelar"
                variant="secondary"
                onPress={() => setIsCreateModalVisible(false)}
                style={{ flex: 1, marginRight: 12 }}
              />
              <Button
                title="Criar"
                onPress={handleCreateNotebook}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  headerActions: { flexDirection: "row", alignItems: "center" },
  iconBtn: { padding: 8, marginLeft: 8 },
  card: { borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  fabContainer: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});
