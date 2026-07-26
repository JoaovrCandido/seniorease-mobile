// src/app/notebook/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
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
import { Button } from "../../presentation/components/ui/Button";
import { useDictation } from "../../presentation/hooks/useDictation";
import { useAccessibility } from "../../presentation/store/AccessibilityContext";
import {
  BlockType,
  useNotebooks,
} from "../../presentation/store/NotebookContext";
import { useToast } from "../../presentation/store/ToastContext";

// Nossos novos blocos de UI isolados
import { MeetingBlockUI } from "../../presentation/components/blocks/MeetingBlockUI";
import { ParagraphBlockUI } from "../../presentation/components/blocks/ParagraphBlockUI";
import { ReminderBlockUI } from "../../presentation/components/blocks/ReminderBlockUI";
import { TaskBlockUI } from "../../presentation/components/blocks/TaskBlockUI";

const ttsService = new TextToSpeechService();

export default function NotebookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { notebooks, addBlock, deleteBlock, updateBlock, toggleTask } =
    useNotebooks();
  const { settings } = useAccessibility();
  const { showToast } = useToast();

  const notebook = notebooks.find((n) => n.id === id);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [blockDate, setBlockDate] = useState("");
  const [blockUrl, setBlockUrl] = useState("");

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

  const { isListening, startDictation, stopDictation } = useDictation(
    (recognizedText) => {
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

  if (!notebook) return null;

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
      showToast("Por favor, digite alguma coisa antes de guardar.", "error");
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
      showToast("Anotação atualizada!", "success");
    } else {
      await addBlock(id, newContent, blockType, extra);
      showToast("Anotação criada!", "success");
      if (blockType === "reminder") {
        await NotificationService.notify("Lembrete Guardado", newContent);
      }
    }

    setIsModalVisible(false);
  };

  const renderBlock = (item: any) => {
    const handleEdit = () => {
      const content =
        "content" in item ? item.content : "title" in item ? item.title : "";
      const date =
        "date" in item ? new Date(item.date).toLocaleDateString("pt-BR") : "";
      const url = "url" in item ? item.url : "";
      handleOpenEditModal(item.id, content, item.type, date, url);
    };

    const handleDelete = () => {
      deleteBlock(id, item.id);
      showToast("Anotação apagada.", "info");
    };

    switch (item.type) {
      case "task":
        return (
          <TaskBlockUI
            block={item}
            onToggle={(blockId) => toggleTask(id, blockId)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      case "reminder":
        return (
          <ReminderBlockUI
            block={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      case "meeting":
        return (
          <MeetingBlockUI
            block={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      default:
        return (
          <ParagraphBlockUI
            block={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
    }
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
          numberOfLines={1}
        >
          {notebook.title}
        </Text>
      </View>

      <FlatList
        data={notebook.blocks.filter((b) => !b.isDeleted)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 * sScale, paddingBottom: 120 }}
        renderItem={({ item }) => renderBlock(item)}
      />

      <View style={styles.fabContainer}>
        <Button
          title="+ Escrever"
          onPress={handleOpenCreateModal}
          style={{ paddingHorizontal: 32 * sScale, borderRadius: 30 }}
        />
      </View>

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

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 20 * sScale, maxHeight: 60 * sScale }}
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
                        color: isActive
                          ? isHighContrast
                            ? "#000"
                            : "#FFF"
                          : theme.textSub,
                      }}
                    >
                      {labels[type]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

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
                  {
                    flex: 1,
                    backgroundColor: theme.bg,
                    color: theme.textMain,
                    borderColor: theme.border,
                    fontSize: 18 * fScale,
                    padding: 16 * sScale,
                    height: 150,
                    textAlignVertical: "top",
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
                  backgroundColor: isListening ? "#FCE8E6" : theme.bg,
                  borderWidth: 2,
                  borderColor: isListening ? "#D93025" : theme.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={isListening ? stopDictation : startDictation}
              >
                <Text style={{ fontSize: 32 * fScale }}>
                  {isListening ? "🛑" : "🎙️"}
                </Text>
              </TouchableOpacity>
            </View>

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
              />
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Button
                title="Cancelar"
                variant="secondary"
                onPress={() => setIsModalVisible(false)}
                style={{ flex: 1, marginRight: 12 }}
              />
              <Button
                title="Guardar"
                onPress={handleSaveBlock}
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
  backButton: { padding: 8, marginRight: 8, borderRadius: 8 },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  input: { borderRadius: 12, borderWidth: 1 },
});
