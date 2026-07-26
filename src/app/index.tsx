// src/app/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { TextToSpeechService } from "../infrastructure/services/TextToSpeechService";
import { useNotebooks } from "../presentation/store/NotebookContext";
import { useSettings } from "../presentation/store/SettingsContext";

const ttsService = new TextToSpeechService();

export default function HomeScreen() {
  const { notebooks, isLoading, createNotebook, deleteNotebook } =
    useNotebooks();

  // 1. Trazemos o perfil e as configurações do contexto
  const { profile, settings } = useSettings();
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  // --- LÓGICA DINÂMICA DE ACESSIBILIDADE ---

  // Cores dinâmicas (Amarelo e Preto para Alto Contraste)
  const theme = {
    bg: settings.highContrast ? "#121212" : "#F4F6F8",
    card: settings.highContrast ? "#1E1E1E" : "#FFFFFF",
    textMain: settings.highContrast ? "#FFFFFF" : "#1A1A1A",
    textSub: settings.highContrast ? "#BBBBBB" : "#666666",
    primary: settings.highContrast ? "#FFD700" : "#0056D2", // Amarelo no alto contraste
    primaryText: settings.highContrast ? "#000000" : "#FFFFFF",
    danger: settings.highContrast ? "#FF6B6B" : "#D93025",
    dangerBg: settings.highContrast ? "#331412" : "#FCE8E6",
    border: settings.highContrast ? "#333333" : "#E0E0E0",
  };

  // Multiplicadores baseados nas configurações
  const fScale =
    settings.fontSize === "extra-large"
      ? 1.4
      : settings.fontSize === "large"
        ? 1.2
        : 1;
  const sScale = settings.spacing === "comfortable" ? 1.5 : 1;

  // Textos Personalizados
  const greetingName = profile.preferredName
    ? `, ${profile.preferredName}`
    : "";
  const complimentText = settings.enableCompliments
    ? "Vamos começar a organizar as suas ideias brilhantes hoje!"
    : "Toque no botão abaixo para começar.";

  // -----------------------------------------

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem(
          "@SeniorEase:hasSeenOnboarding",
        );
        if (!hasSeen) {
          setShowOnboarding(true);
          playOnboardingAudio(0);
        }
      } catch (error) {
        console.error("Erro ao verificar onboarding:", error);
      }
    };
    checkOnboarding();
    return () => ttsService.cancel();
  }, [profile.preferredName]); // Recarrega se o nome mudar

  const playOnboardingAudio = (step: number) => {
    ttsService.cancel();
    const nameStr = profile.preferredName ? ` ${profile.preferredName}` : "";
    if (step === 0) {
      ttsService.speak(
        `Bem-vindo ao Senior Ease${nameStr}. O seu caderno digital inteligente.`,
      );
    } else if (step === 1) {
      ttsService.speak(
        "Aqui pode guardar as suas anotações. Toque em 'Começar' para criar o seu primeiro caderno.",
      );
    }
  };

  const handleNextOnboardingStep = async () => {
    if (onboardingStep === 0) {
      setOnboardingStep(1);
      playOnboardingAudio(1);
    } else {
      await AsyncStorage.setItem("@SeniorEase:hasSeenOnboarding", "true");
      ttsService.cancel();
      setShowOnboarding(false);
    }
  };

  const handleConfirmDelete = (id: string, title: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Tem a certeza que deseja apagar "${title}"?`,
      );
      if (confirmed) deleteNotebook(id);
      return;
    }

    // Se "Segurança contra Cliques" estiver ativa, exigimos confirmação. Senão, apaga direto.
    if (settings.clickSecurity) {
      Alert.alert("Apagar Caderno", `Deseja mesmo apagar "${title}"?`, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: () => deleteNotebook(id),
        },
      ]);
    } else {
      deleteNotebook(id);
    }
  };

  const handleSaveNotebook = async () => {
    if (newTitle.trim() === "") {
      Alert.alert("Atenção", "Por favor, dê um título ao seu caderno.");
      return;
    }
    await createNotebook(newTitle, newDescription, "notebook");
    setNewTitle("");
    setNewDescription("");
    setIsModalVisible(false);

    // Elogio audível ao criar um caderno com sucesso!
    if (settings.enableCompliments) {
      ttsService.speak("Excelente trabalho! Caderno criado com sucesso.");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text
          style={{
            marginTop: 16,
            fontSize: 18 * fScale,
            color: theme.textMain,
          }}
        >
          A carregar...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* CABEÇALHO COM ESTILOS DINÂMICOS */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.card,
            borderBottomColor: theme.border,
            paddingBottom: 20 * sScale,
          },
        ]}
      >
        <Text
          style={{
            fontSize: 28 * fScale,
            fontWeight: "bold",
            color: theme.textMain,
            flex: 1,
          }}
        >
          Olá{greetingName} 👋
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={{
            padding: 12 * sScale,
            backgroundColor: settings.highContrast ? "#333" : "#E8F0FE",
            borderRadius: 8,
          }}
          accessibilityLabel="Abrir configurações de perfil"
        >
          <Text style={{ fontSize: 20 * fScale }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notebooks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 * sScale, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 20 * fScale,
                fontWeight: "600",
                color: theme.textMain,
                textAlign: "center",
              }}
            >
              Você ainda não tem anotações.
            </Text>
            <Text
              style={{
                fontSize: 16 * fScale,
                color: theme.textSub,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              {complimentText}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                padding: 20 * sScale,
                marginBottom: 16 * sScale,
              },
            ]}
            activeOpacity={0.7}
            onPress={() => router.push(`/notebook/${item.id}`)}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 22 * fScale,
                  fontWeight: "bold",
                  color: theme.textMain,
                  marginBottom: 4 * sScale,
                }}
              >
                {item.title}
              </Text>
              <Text style={{ fontSize: 16 * fScale, color: theme.textSub }}>
                {item.createdAt.toLocaleDateString("pt-BR")}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: theme.dangerBg,
                paddingVertical: 12 * sScale,
                paddingHorizontal: 16 * sScale,
                borderRadius: 8,
                marginLeft: 12,
              }}
              onPress={() => handleConfirmDelete(item.id, item.title)}
            >
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
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: theme.primary,
            paddingVertical: 16 * sScale,
            paddingHorizontal: 32 * sScale,
          },
        ]}
        onPress={() => setIsModalVisible(true)}
      >
        <Text
          style={{
            color: theme.primaryText,
            fontSize: 20 * fScale,
            fontWeight: "bold",
          }}
        >
          + Novo Caderno
        </Text>
      </TouchableOpacity>

      {/* MODAL MANTIDO IGUAL MAS COM CORES DINÂMICAS NAS VIEWS PRINCIPAIS */}
      <Modal
        visible={isModalVisible}
        animationType={settings.reduceMotion ? "none" : "slide"}
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.card, padding: 24 * sScale },
            ]}
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
              Criar Caderno
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.bg,
                  color: theme.textMain,
                  borderColor: theme.border,
                  fontSize: 18 * fScale,
                  padding: 16 * sScale,
                  marginBottom: 20 * sScale,
                },
              ]}
              placeholder="Ex: Receitas, Diário..."
              value={newTitle}
              onChangeText={setNewTitle}
              placeholderTextColor={theme.textSub}
              autoFocus
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 16 * sScale,
                  backgroundColor: theme.bg,
                  borderRadius: 12,
                  marginRight: 12,
                  alignItems: "center",
                }}
                onPress={() => setIsModalVisible(false)}
              >
                <Text
                  style={{
                    fontSize: 18 * fScale,
                    fontWeight: "bold",
                    color: theme.textSub,
                  }}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 16 * sScale,
                  backgroundColor: theme.primary,
                  borderRadius: 12,
                  alignItems: "center",
                }}
                onPress={handleSaveNotebook}
              >
                <Text
                  style={{
                    fontSize: 18 * fScale,
                    fontWeight: "bold",
                    color: theme.primaryText,
                  }}
                >
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ONBOARDING */}
      <Modal
        visible={showOnboarding}
        animationType={settings.reduceMotion ? "none" : "fade"}
        transparent={false}
      >
        <View
          style={[styles.onboardingContainer, { backgroundColor: theme.bg }]}
        >
          <Text style={{ fontSize: 80, marginBottom: 24 }}>👋</Text>
          <Text
            style={{
              fontSize: 32 * fScale,
              fontWeight: "bold",
              color: theme.primary,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {onboardingStep === 0
              ? `Bem-vindo${greetingName}`
              : "Tudo num só lugar"}
          </Text>
          <Text
            style={{
              fontSize: 22 * fScale,
              color: theme.textMain,
              textAlign: "center",
              lineHeight: 32 * fScale,
              marginBottom: 48,
            }}
          >
            {onboardingStep === 0
              ? "O seu caderno digital inteligente, feito para ser simples e fácil de usar."
              : "Aqui pode guardar as suas anotações e lembretes. Vamos começar?"}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme.primary,
              paddingVertical: 18 * sScale,
              paddingHorizontal: 40 * sScale,
              borderRadius: 30,
              width: "100%",
              alignItems: "center",
            }}
            onPress={handleNextOnboardingStep}
          >
            <Text
              style={{
                color: theme.primaryText,
                fontSize: 22 * fScale,
                fontWeight: "bold",
              }}
            >
              {onboardingStep === 0 ? "Continuar" : "Começar a usar"}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

// O StyleSheet agora guarda apenas regras estruturais estáticas que não dependem das cores dinâmicas.
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  input: { borderRadius: 12, borderWidth: 1 },
  onboardingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
