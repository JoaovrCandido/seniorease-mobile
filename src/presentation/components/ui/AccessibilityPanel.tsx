import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";

export const AccessibilityPanel = () => {
  const { settings, updateSettings } = useAccessibility();

  const fScale =
    settings.fontSize === "extra-large"
      ? 1.4
      : settings.fontSize === "large"
        ? 1.2
        : 1;
  const isHighContrast = settings.highContrast;

  const theme = {
    cardBg: isHighContrast ? "#1E1E1E" : "#FFFFFF",
    textMain: isHighContrast ? "#FFFFFF" : "#1A1A1A",
    textSub: isHighContrast ? "#BBBBBB" : "#666666",
    border: isHighContrast ? "#333333" : "#E5E7EB",
    primary: isHighContrast ? "#FFD700" : "#0056D2",
    primaryText: isHighContrast ? "#000000" : "#FFFFFF",
  };

  const handleFontSizeChange = (size: "normal" | "large" | "extra-large") => {
    updateSettings({ fontSize: size });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.cardBg, borderColor: theme.border },
      ]}
    >
      <Text
        style={[styles.title, { color: theme.textMain, fontSize: 22 * fScale }]}
      >
        Ajustes Visuais
      </Text>

      {/* Alto Contraste */}
      <View style={[styles.row, { borderBottomColor: theme.border }]}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.label,
              { color: theme.textMain, fontSize: 18 * fScale },
            ]}
          >
            Alto Contraste
          </Text>
          <Text style={{ color: theme.textSub, fontSize: 14 * fScale }}>
            Cores mais fortes e fundos escuros.
          </Text>
        </View>
        <Switch
          value={settings.highContrast}
          onValueChange={(val) => updateSettings({ highContrast: val })}
          trackColor={{ false: "#767577", true: theme.primary }}
        />
      </View>

      {/* Espaçamento Confortável */}
      <View style={[styles.row, { borderBottomColor: theme.border }]}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.label,
              { color: theme.textMain, fontSize: 18 * fScale },
            ]}
          >
            Área de Toque Maior
          </Text>
          <Text style={{ color: theme.textSub, fontSize: 14 * fScale }}>
            Mais espaço entre os botões.
          </Text>
        </View>
        <Switch
          value={settings.spacing === "comfortable"}
          onValueChange={(val) =>
            updateSettings({ spacing: val ? "comfortable" : "normal" })
          }
          trackColor={{ false: "#767577", true: theme.primary }}
        />
      </View>

      {/* Tamanho da Letra */}
      <View style={styles.fontRow}>
        <Text
          style={[
            styles.label,
            { color: theme.textMain, fontSize: 18 * fScale, marginBottom: 12 },
          ]}
        >
          Tamanho do Texto
        </Text>
        <View style={styles.buttonGroup}>
          {(["normal", "large", "extra-large"] as const).map((size) => {
            const isActive = settings.fontSize === size;
            const labels = { normal: "A", large: "A+", "extra-large": "A++" };
            return (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  {
                    backgroundColor: isActive ? theme.primary : "transparent",
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => handleFontSizeChange(size)}
              >
                <Text
                  style={{
                    color: isActive ? theme.primaryText : theme.primary,
                    fontSize:
                      size === "normal" ? 16 : size === "large" ? 20 : 24,
                    fontWeight: "bold",
                  }}
                >
                  {labels[size]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  title: { fontWeight: "bold", marginBottom: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  label: { fontWeight: "600", marginBottom: 4 },
  fontRow: { paddingTop: 16 },
  buttonGroup: { flexDirection: "row", gap: 12 },
  sizeButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
