import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";
import { useNotebooks } from "../../store/NotebookContext";
import { Input } from "./Input";
import { Modal } from "./Modal";

interface CommandPaletteProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToNotebook: (id: string) => void;
}

export const CommandPalette = ({
  visible,
  onClose,
  onNavigateToNotebook,
}: CommandPaletteProps) => {
  const { notebooks } = useNotebooks();
  const { settings } = useAccessibility();
  const [search, setSearch] = useState("");

  const fScale =
    settings.fontSize === "extra-large"
      ? 1.4
      : settings.fontSize === "large"
        ? 1.2
        : 1;
  const isHighContrast = settings.highContrast;

  const theme = {
    itemBg: isHighContrast ? "#333333" : "#F4F6F8",
    textMain: isHighContrast ? "#FFFFFF" : "#1A1A1A",
  };

  const filteredNotebooks = notebooks.filter(
    (n) => n.title.toLowerCase().includes(search.toLowerCase()) && !n.isDeleted,
  );

  return (
    <Modal visible={visible} onClose={onClose} title="Busca Rápida">
      <Input
        placeholder="Procurar caderno..."
        value={search}
        onChangeText={setSearch}
        autoFocus
      />

      <FlatList
        data={filteredNotebooks}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 16, maxHeight: 300 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: theme.itemBg }]}
            onPress={() => {
              onClose();
              onNavigateToNotebook(item.id);
            }}
          >
            <Text style={{ fontSize: 24 * fScale, marginRight: 12 }}>
              {item.icon}
            </Text>
            <Text
              style={{
                fontSize: 18 * fScale,
                color: theme.textMain,
                fontWeight: "bold",
              }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 16 * fScale,
              color: theme.textMain,
            }}
          >
            Nenhum caderno encontrado.
          </Text>
        }
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
});
