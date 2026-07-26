import { ReactNode } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Modal as RNModal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ visible, onClose, title, children }: ModalProps) => {
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
    textMain: isHighContrast ? "#FFFFFF" : "#1A1A1A",
    closeBtn: isHighContrast ? "#BBBBBB" : "#666666",
  };

  return (
    <RNModal
      visible={visible}
      animationType={settings.reduceMotion ? "none" : "slide"}
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.content,
            { backgroundColor: theme.cardBg, padding: 24 * sScale },
          ]}
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: theme.textMain, fontSize: 24 * fScale },
              ]}
            >
              {title}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              accessibilityLabel="Fechar janela"
            >
              <Text style={{ fontSize: 28 * fScale, color: theme.closeBtn }}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          {children}
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontWeight: "bold" },
});
