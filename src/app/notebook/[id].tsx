// src/app/notebook/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NotificationService } from "../../infrastructure/services/NotificationService";
import { TextToSpeechService } from "../../infrastructure/services/TextToSpeechService";
import { useDictation } from "../../presentation/hooks/useDictation";
import {
  BlockType,
  useNotebooks,
} from "../../presentation/store/NotebookContext";
import { useSettings } from "../../presentation/store/SettingsContext";

const ttsService = new TextToSpeechService();

export default function NotebookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Trazemos os contextos
  const { notebooks, addBlock, deleteBlock, updateBlock, toggleTask } =
    useNotebooks();
  const { settings } = useSettings();

  const notebook = notebooks.find((n) => n.id === id);

  // Estados do Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [blockDate, setBlockDate] = useState("");
  const [blockUrl, setBlockUrl] = useState("");

  // --- LÓGICA DINÂMICA DE ACESSIBILIDADE ---
  const theme = {
    bg: settings.highContrast ? "#121212" : "#F4F6F8",
    card: settings.highContrast ? "#1E1E1E" : "#FFFFFF",
    textMain: settings.highContrast ? "#FFFFFF" : "#1A1A1A",
    textSub: settings.highContrast ? "#BBBBBB" : "#666666",
    primary: settings.highContrast ? "#FFD700" : "#0056D2",
    primaryText: settings.highContrast ? "#000000" : "#FFFFFF",
    danger: settings.highContrast ? "#FF6B6B" : "#D93025",
    dangerBg: settings.highContrast ? "#331412" : "#FCE8E6",
    border: settings.highContrast ? "#333333" : "#E0E0E0",
    success: settings.highContrast ? "#4ADE80" : "#137333",
  };

  const fScale =
    settings.fontSize === "extra-large"
      ? 1.4
      : settings.fontSize === "large"
        ? 1.2
        : 1;
  const sScale = settings.spacing === "comfortable" ? 1.5 : 1;
  // -----------------------------------------

  // Hook de Ditação Nativa
  const { isListening, startDictation, stopDictation } = useDictation(
    (recognizedText) => {
      // Adiciona o texto falado ao que já estava escrito
      setNewContent((prev) =>
        prev ? `${prev} ${recognizedText}` : recognizedText,
      );
    },
  );

  useEffect(() => {
    return () => {
      ttsService.cancel();
      stopDictation();
    };
  }, [stopDictation]);

  if (!notebook) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text
          style={{
            fontSize: 20 * fScale,
            color: theme.danger,
            marginBottom: 16,
            fontWeight: "bold",
          }}
        >
          Caderno não encontrado.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: theme.primary,
            padding: 12,
            borderRadius: 8,
          }}
          onPress={() => router.back()}
        >
          <Text
            style={{
              color: theme.primaryText,
              fontSize: 18 * fScale,
              fontWeight: "bold",
            }}
          >
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleOpenCreateModal = () => {
    setEditingBlockId(null);
    setNewContent("");
    setBlockDate("");
    setBlockUrl("");
    setBlockType("paragraph");
    setIsModalVisible(true);
  };

  const handleOpenEditModal = (
    blockId: string,
    currentContent: string,
    type: BlockType,
    dateStr?: string,
    urlStr?: string,
  ) => {
    setEditingBlockId(blockId);
    setNewContent(currentContent);
    setBlockType(type);
    setBlockDate(dateStr || "");
    setBlockUrl(urlStr || "");
    setIsModalVisible(true);
  };

  const handleSaveBlock = async () => {
    if (newContent.trim() === "") {
      Alert.alert(
        "Atenção",
        "Por favor, digite alguma coisa antes de guardar.",
      );
      return;
    }

    let finalDate = new Date();
    if (blockDate.includes("/")) {
      const [day, month, year] = blockDate.split("/");
      if (day && month && year)
        finalDate = new Date(Number(year), Number(month) - 1, Number(day));
    }

    const extra = { url: blockUrl, date: finalDate };

    if (editingBlockId) {
      await updateBlock(id, editingBlockId, newContent, blockType, extra);
    } else {
      await addBlock(id, newContent, blockType, extra);
      if (blockType === "reminder") {
        await NotificationService.notify("Lembrete Guardado", newContent);
      }
    }

    setNewContent("");
    setBlockDate("");
    setBlockUrl("");
    setEditingBlockId(null);
    setIsModalVisible(false);
  };

  const handleConfirmDeleteBlock = (blockId: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Tem a certeza que deseja apagar?");
      if (confirmed) deleteBlock(id, blockId);
      return;
    }

    if (settings.clickSecurity) {
      Alert.alert("Apagar Anotação", "Tem a certeza que deseja apagar?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: () => deleteBlock(id, blockId),
        },
      ]);
    } else {
      deleteBlock(id, blockId);
    }
  };

  const handleSpeak = () => {
    const textToRead = notebook.blocks
      .filter((b) => !b.isDeleted)
      .map((b) => {
        if ("content" in b) return b.content;
        if ("title" in b)
          return `${b.type === "meeting" ? "Reunião" : "Anotação"}: ${b.title}`;
        return "";
      })
      .join(". ");

    ttsService.speak(
      `Caderno: ${notebook.title}. Anotações: ${textToRead || "Vazio."}`,
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* CABEÇALHO */}
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
          style={{
            padding: 8,
            marginRight: 8,
            backgroundColor: settings.highContrast ? "#333" : "#E8F0FE",
            borderRadius: 8,
          }}
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
          numberOfLines={1}
        >
          {notebook.title}
        </Text>
        <TouchableOpacity
          onPress={handleSpeak}
          style={{
            padding: 8,
            backgroundColor: settings.highContrast ? "#133320" : "#E6F4EA",
            borderRadius: 8,
            marginLeft: 8,
          }}
        >
          <Text
            style={{
              fontSize: 16 * fScale,
              color: theme.success,
              fontWeight: "bold",
            }}
          >
            🔊 Ouvir
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTA DE ANOTAÇÕES */}
      <FlatList
        data={notebook.blocks.filter((b) => !b.isDeleted)}
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
              Este caderno ainda não tem anotações.
            </Text>
            <Text
              style={{
                fontSize: 16 * fScale,
                color: theme.textSub,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              {settings.enableCompliments
                ? "Use o microfone no botão abaixo para ditar a sua primeira ideia!"
                : "Use o botão abaixo para adicionar."}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isTask = item.type === "task";
          const isReminder = item.type === "reminder";
          const isMeeting = item.type === "meeting";
          const content =
            "content" in item
              ? item.content
              : "title" in item
                ? item.title
                : "";
          const isCompleted =
            isTask || isReminder ? (item as any).isCompleted : false;
          const date =
            "date" in item
              ? new Date(item.date as Date).toLocaleDateString("pt-BR")
              : "";
          const url = "url" in item ? (item.url as string) : "";

          return (
            <View
              style={[
                styles.blockCard,
                {
                  backgroundColor: theme.card,
                  borderLeftColor: isCompleted ? theme.success : theme.primary,
                  opacity: isCompleted ? 0.7 : 1,
                  padding: 20 * sScale,
                  marginBottom: 12 * sScale,
                },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                {(isTask || isReminder) && (
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      {
                        borderColor: isCompleted
                          ? theme.success
                          : theme.primary,
                        backgroundColor: isCompleted
                          ? theme.success
                          : "transparent",
                        width: 32 * fScale,
                        height: 32 * fScale,
                        marginRight: 16 * sScale,
                      },
                    ]}
                    onPress={() => toggleTask(id, item.id)}
                  >
                    {isCompleted && (
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
                )}

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 20 * fScale,
                      lineHeight: 28 * fScale,
                      color: isCompleted ? theme.textSub : theme.textMain,
                      textDecorationLine: isCompleted ? "line-through" : "none",
                    }}
                  >
                    {content}
                  </Text>
                  {(isReminder || isMeeting) && (
                    <Text
                      style={{
                        fontSize: 16 * fScale,
                        color: theme.textSub,
                        marginTop: 8 * sScale,
                        fontWeight: "bold",
                      }}
                    >
                      📅 Data: {date}
                    </Text>
                  )}
                  {isMeeting && url !== "" && (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(url)}
                      style={{
                        backgroundColor: settings.highContrast
                          ? "#333"
                          : "#E8F0FE",
                        padding: 12 * sScale,
                        borderRadius: 8,
                        marginTop: 12 * sScale,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: theme.primary,
                          fontSize: 16 * fScale,
                          fontWeight: "bold",
                        }}
                      >
                        🔗 Aceder à Reunião
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 16 * sScale,
                  paddingTop: 16 * sScale,
                  borderTopWidth: 1,
                  borderTopColor: theme.border,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: settings.highContrast ? "#333" : "#E8F0FE",
                    paddingVertical: 8 * sScale,
                    paddingHorizontal: 16 * sScale,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                  onPress={() =>
                    handleOpenEditModal(
                      item.id,
                      content,
                      item.type as BlockType,
                      date,
                      url,
                    )
                  }
                >
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

                <TouchableOpacity
                  style={{
                    backgroundColor: theme.dangerBg,
                    paddingVertical: 8 * sScale,
                    paddingHorizontal: 16 * sScale,
                    borderRadius: 8,
                  }}
                  onPress={() => handleConfirmDeleteBlock(item.id)}
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
              </View>
            </View>
          );
        }}
      />

      {/* BOTÃO FLUTUANTE (FAB) */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: theme.primary,
            paddingVertical: 16 * sScale,
            paddingHorizontal: 32 * sScale,
          },
        ]}
        onPress={handleOpenCreateModal}
      >
        <Text
          style={{
            color: theme.primaryText,
            fontSize: 20 * fScale,
            fontWeight: "bold",
          }}
        >
          + Escrever
        </Text>
      </TouchableOpacity>

      {/* MODAL DE CRIAÇÃO/EDIÇÃO COM MICROFONE */}
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
              {editingBlockId ? "Editar" : "Nova Entrada"}
            </Text>

            {/* Seletor de Tipo */}
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 20 * sScale }}
              >
                {(
                  ["paragraph", "task", "reminder", "meeting"] as BlockType[]
                ).map((type) => {
                  const labels = {
                    paragraph: "📝 Texto",
                    task: "✅ Tarefa",
                    reminder: "⏰ Lembrete",
                    meeting: "📹 Reunião",
                  };
                  const isActive = blockType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={{
                        paddingVertical: 12 * sScale,
                        paddingHorizontal: 16 * sScale,
                        alignItems: "center",
                        borderRadius: 8,
                        marginRight: 8,
                        backgroundColor: isActive ? theme.primary : theme.bg,
                      }}
                      onPress={() => setBlockType(type)}
                    >
                      <Text
                        style={{
                          fontSize: 16 * fScale,
                          fontWeight: "bold",
                          color: isActive ? theme.primaryText : theme.textSub,
                        }}
                      >
                        {labels[type]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* ZONA DE ESCRITA E DITAÇÃO (MICROFONE) */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 20 * sScale,
              }}
            >
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    flex: 1,
                    marginBottom: 0,
                    backgroundColor: theme.bg,
                    color: theme.textMain,
                    borderColor: theme.border,
                    fontSize: 18 * fScale,
                    padding: 16 * sScale,
                  },
                ]}
                placeholder={
                  isListening ? "A escutar..." : "O que deseja anotar?"
                }
                value={newContent}
                onChangeText={setNewContent}
                placeholderTextColor={theme.textSub}
                multiline
              />

              <TouchableOpacity
                style={{
                  marginLeft: 12,
                  padding: 20 * sScale,
                  borderRadius: 30,
                  backgroundColor: isListening
                    ? theme.dangerBg
                    : settings.highContrast
                      ? "#333"
                      : "#E8F0FE",
                  borderWidth: 2,
                  borderColor: isListening ? theme.danger : theme.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={isListening ? stopDictation : startDictation}
                accessibilityLabel={
                  isListening ? "Parar gravação" : "Ditar em voz alta"
                }
              >
                <Text style={{ fontSize: 32 * fScale }}>
                  {isListening ? "🛑" : "🎙️"}
                </Text>
              </TouchableOpacity>
            </View>

            {isListening && (
              <Text
                style={{
                  color: theme.danger,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 16 * sScale,
                  fontSize: 16 * fScale,
                }}
              >
                Pode falar, estou a ouvir...
              </Text>
            )}

            {(blockType === "reminder" || blockType === "meeting") && (
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
                placeholder="Data (Ex: 22/07/2026)"
                value={blockDate}
                onChangeText={setBlockDate}
                placeholderTextColor={theme.textSub}
              />
            )}

            {blockType === "meeting" && (
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
                placeholder="Link da Reunião (https://...)"
                value={blockUrl}
                onChangeText={setBlockUrl}
                placeholderTextColor={theme.textSub}
                keyboardType="url"
                autoCapitalize="none"
              />
            )}

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
                onPress={handleSaveBlock}
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
    </View>
  );
}

// Estilos estruturais que não dependem do tema dinâmico
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  blockCard: {
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
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
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  input: { borderRadius: 12, borderWidth: 1 },
  textArea: { height: 150, textAlignVertical: "top" },
});
