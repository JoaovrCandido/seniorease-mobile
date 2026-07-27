import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
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
import { PraiseService } from "../../infrastructure/services/PraiseService";
import { TextToSpeechService } from "../../infrastructure/services/TextToSpeechService";
import { MeetingBlockUI } from "../../presentation/components/blocks/MeetingBlockUI";
import { ParagraphBlockUI } from "../../presentation/components/blocks/ParagraphBlockUI";
import { ReminderBlockUI } from "../../presentation/components/blocks/ReminderBlockUI";
import { TaskBlockUI } from "../../presentation/components/blocks/TaskBlockUI";
import { Button } from "../../presentation/components/ui/Button";
import { EmojiPicker } from "../../presentation/components/ui/EmojiPicker";
import { Input } from "../../presentation/components/ui/Input";
import { OnboardingTour } from "../../presentation/components/ui/OnboardingTour";
import { useDictation } from "../../presentation/hooks/useDictation";
import { useAccessibility } from "../../presentation/store/AccessibilityContext";
import {
  BlockType,
  useNotebooks,
} from "../../presentation/store/NotebookContext";
import { useToast } from "../../presentation/store/ToastContext";
import { useUserProfile } from "../../presentation/store/UserProfileContext";

const ttsService = new TextToSpeechService();

export default function NotebookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    notebooks,
    addBlock,
    deleteBlock,
    updateBlock,
    toggleTask,
    deleteNotebook,
    updateNotebook,
    reorderBlocks,
  } = useNotebooks();
  const { settings } = useAccessibility();
  const { profile } = useUserProfile();
  const { showToast } = useToast();

  const notebook = notebooks.find((n) => n.id === id);

  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [blockDate, setBlockDate] = useState("");
  const [blockUrl, setBlockUrl] = useState("");

  const [isNotebookSettingsVisible, setIsNotebookSettingsVisible] =
    useState(false);
  const [editNotebookTitle, setEditNotebookTitle] = useState("");
  const [editNotebookDesc, setEditNotebookDesc] = useState("");
  const [editNotebookIcon, setEditNotebookIcon] = useState("");

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

  const visibleBlocks = notebook.blocks.filter((b) => !b.isDeleted);

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
      if (day && month && year) {
        finalDate = new Date(Number(year), Number(month) - 1, Number(day));
      }
    }

    const extra = { url: blockUrl, date: finalDate };

    if (editingBlockId) {
      await updateBlock(id, editingBlockId, newContent, blockType, extra);

      const msg = settings.encouragement
        ? PraiseService.getRandomPraise("update", profile.preferredName)
        : "Anotação atualizada!";
      showToast(msg, "success");
    } else {
      await addBlock(id, newContent, blockType, extra);

      if (settings.encouragement) {
        showToast(
          PraiseService.getRandomPraise(blockType, profile.preferredName),
          "success",
        );
      } else {
        showToast("Anotação criada!", "success");
      }

      if (blockType === "reminder") {
        await NotificationService.notify("Lembrete Guardado", newContent);
      }
    }
    setIsModalVisible(false);
  };

  const renderBlock = (item: unknown, index: number) => {
    const block = item as Record<string, unknown>;
    const handleEdit = () => {
      const content =
        "content" in block
          ? String(block.content)
          : "title" in block
            ? String(block.title)
            : "";
      const date =
        "date" in block
          ? new Date(String(block.date)).toLocaleDateString("pt-BR")
          : "";
      const url =
        "meetingUrl" in block
          ? String(block.meetingUrl)
          : "url" in block
            ? String(block.url)
            : "";
      handleOpenEditModal(
        String(block.id),
        content,
        String(block.type) as BlockType,
        date,
        url,
      );
    };

    const handleDelete = () => {
      if (settings.clickProtection) {
        Alert.alert(
          "Deseja mesmo apagar?",
          "Para sua segurança, confirme se quer remover esta anotação.",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Sim, apagar",
              style: "destructive",
              onPress: () => {
                deleteBlock(id, String(block.id));
                showToast("Anotação apagada com segurança.", "info");
              },
            },
          ],
        );
      } else {
        deleteBlock(id, String(block.id));
        showToast("Anotação apagada.", "info");
      }
    };

    const toggleStatus = () => {
      toggleTask(id, String(block.id));
      if (settings.encouragement && !block.isCompleted) {
        showToast(
          PraiseService.getRandomPraise("task", profile.preferredName),
          "success",
        );
      }
    };

    const handleMoveUp = () => {
      if (index === 0) return;
      const newOrder = [...visibleBlocks];
      const temp = newOrder[index];
      newOrder[index] = newOrder[index - 1];
      newOrder[index - 1] = temp;
      reorderBlocks(
        id,
        newOrder.map((b) => String(b.id)),
      );
    };

    const handleMoveDown = () => {
      if (index === visibleBlocks.length - 1) return;
      const newOrder = [...visibleBlocks];
      const temp = newOrder[index];
      newOrder[index] = newOrder[index + 1];
      newOrder[index + 1] = temp;
      reorderBlocks(
        id,
        newOrder.map((b) => String(b.id)),
      );
    };

    const BlockContent = () => {
      switch (block.type) {
        case "task":
          return (
            <TaskBlockUI
              block={
                block as unknown as Parameters<typeof TaskBlockUI>[0]["block"]
              }
              onToggle={toggleStatus}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          );
        case "reminder":
          return (
            <ReminderBlockUI
              block={
                block as unknown as Parameters<
                  typeof ReminderBlockUI
                >[0]["block"]
              }
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          );
        case "meeting":
          return (
            <MeetingBlockUI
              block={
                block as unknown as Parameters<
                  typeof MeetingBlockUI
                >[0]["block"]
              }
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          );
        default:
          return (
            <ParagraphBlockUI
              block={
                block as unknown as Parameters<
                  typeof ParagraphBlockUI
                >[0]["block"]
              }
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          );
      }
    };

    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <View
          style={{
            marginRight: 12,
            alignItems: "center",
            backgroundColor: theme.bg,
            borderRadius: 8,
          }}
        >
          <TouchableOpacity
            onPress={handleMoveUp}
            disabled={index === 0}
            style={{ padding: 12, opacity: index === 0 ? 0.2 : 1 }}
          >
            <Text style={{ fontSize: 24 * fScale }}>⬆️</Text>
          </TouchableOpacity>
          <View
            style={{ height: 1, backgroundColor: theme.border, width: "100%" }}
          />
          <TouchableOpacity
            onPress={handleMoveDown}
            disabled={index === visibleBlocks.length - 1}
            style={{
              padding: 12,
              opacity: index === visibleBlocks.length - 1 ? 0.2 : 1,
            }}
          >
            <Text style={{ fontSize: 24 * fScale }}>⬇️</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ marginBottom: -16 }}>
            <BlockContent />
          </View>
        </View>
      </View>
    );
  };

  const openNotebookSettings = () => {
    setEditNotebookTitle(notebook.title);
    setEditNotebookDesc(notebook.description || "");
    setEditNotebookIcon(notebook.icon || "📘");
    setIsNotebookSettingsVisible(true);
  };

  const handleUpdateNotebook = async () => {
    if (!editNotebookTitle.trim()) {
      showToast("O nome do caderno não pode estar vazio.", "error");
      return;
    }
    await updateNotebook(
      id,
      editNotebookTitle,
      editNotebookDesc,
      editNotebookIcon,
    );
    setIsNotebookSettingsVisible(false);

    const msg = settings.encouragement
      ? PraiseService.getRandomPraise("update", profile.preferredName)
      : "Caderno atualizado!";
    showToast(msg, "success");
  };

  const handleDeleteNotebook = () => {
    Alert.alert(
      "Apagar Caderno Inteiro",
      "Tem a certeza que deseja apagar este caderno? Ele irá para a lixeira.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, apagar caderno",
          style: "destructive",
          onPress: async () => {
            setIsNotebookSettingsVisible(false);
            await deleteNotebook(id);
            showToast("Caderno enviado para a lixeira.", "info");
            router.replace("/");
          },
        },
      ],
    );
  };

  const firstName = profile.preferredName
    ? profile.preferredName.trim().split(" ")[0]
    : "";

  const notebookSteps = [
    {
      title: `Caderno${firstName ? ` de ${firstName}` : ""}`,
      text: "Aqui pode guardar textos, tarefas, lembretes ou reuniões. Para organizar os seus itens, use as setas (⬆️⬇️) do lado esquerdo.",
    },
    {
      title: "Adicionar Anotações",
      text: "Toque no botão '+ Escrever' em baixo. Pode até usar a voz para ditar o texto (🎙️)!",
    },
    {
      title: "Configurações do Caderno",
      text: "Tocou na engrenagem (⚙️) no topo? Lá pode mudar o nome ou apagar este caderno inteiro.",
    },
    {
      title: "Gerir uma Anotação",
      text: "Cada anotação tem botões para 'Editar' ou 'Apagar'. Se for uma tarefa, basta tocar nela para a marcar como concluída.",
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
            textAlign: "center",
          }}
          numberOfLines={1}
        >
          {notebook.icon} {notebook.title}
        </Text>
        <View style={{ flexDirection: "row" }}>
          {!settings.advancedMode && (
            <TouchableOpacity
              onPress={() => setIsHelpVisible(true)}
              style={styles.settingsButton}
            >
              <Text style={{ fontSize: 24 * fScale }}>❓</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={openNotebookSettings}
            style={styles.settingsButton}
          >
            <Text style={{ fontSize: 24 * fScale }}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <OnboardingTour
        visible={isHelpVisible}
        onComplete={() => setIsHelpVisible(false)}
        steps={notebookSteps}
      />

      <FlatList
        data={visibleBlocks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 * sScale, paddingBottom: 120 }}
        renderItem={({ item, index }) => renderBlock(item, index)}
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
          behavior={Platform.OS === "ios" ? "padding" : undefined}
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

      <Modal
        visible={isNotebookSettingsVisible}
        animationType={settings.reduceMotion ? "none" : "slide"}
        transparent={true}
        onRequestClose={() => setIsNotebookSettingsVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
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
              Editar Caderno
            </Text>
            <EmojiPicker
              selectedEmoji={editNotebookIcon}
              onSelect={setEditNotebookIcon}
            />
            <Input
              label="Nome do Caderno"
              value={editNotebookTitle}
              onChangeText={setEditNotebookTitle}
            />
            <Input
              label="Descrição (Opcional)"
              value={editNotebookDesc}
              onChangeText={setEditNotebookDesc}
            />
            <Button
              title="Guardar Alterações"
              onPress={handleUpdateNotebook}
              style={{ marginTop: 16 * sScale, marginBottom: 24 * sScale }}
            />
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: theme.border,
                paddingTop: 16 * sScale,
              }}
            >
              <Button
                title="Apagar Caderno Inteiro"
                variant="danger"
                onPress={handleDeleteNotebook}
              />
            </View>
            <View style={{ marginTop: 16 * sScale }}>
              <Button
                title="Cancelar"
                variant="secondary"
                onPress={() => setIsNotebookSettingsVisible(false)}
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
    justifyContent: "space-between",
  },
  backButton: { padding: 8, borderRadius: 8 },
  settingsButton: { padding: 8, borderRadius: 8 },
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
