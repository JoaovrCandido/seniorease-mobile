// src/app/profile.tsx
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    AccessibilitySettings,
    UserProfile,
    useSettings,
} from "../presentation/store/SettingsContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, settings, updateProfile, updateSettings } = useSettings();

  // Estados locais para edição (evita gravar no disco a cada letra digitada)
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [localSettings, setLocalSettings] =
    useState<AccessibilitySettings>(settings);

  // Sincroniza caso os dados demorem um pouco a carregar
  useEffect(() => {
    setLocalProfile(profile);
    setLocalSettings(settings);
  }, [profile, settings]);

  const handleSave = async () => {
    await updateProfile(localProfile);
    await updateSettings(localSettings);
    Alert.alert(
      "Sucesso",
      "As suas preferências foram guardadas com sucesso!",
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  // Componente auxiliar para os botões de seleção (Tabs)
  const OptionSelector = ({
    options,
    selectedValue,
    onSelect,
  }: {
    options: { label: string; value: string }[];
    selectedValue: string;
    onSelect: (val: any) => void;
  }) => (
    <View style={styles.selectorContainer}>
      {options.map((opt) => {
        const isActive = selectedValue === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.selectorButton,
              isActive && styles.selectorButtonActive,
            ]}
            onPress={() => onSelect(opt.value)}
          >
            <Text
              style={[
                styles.selectorText,
                isActive && styles.selectorTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBackButton}
        >
          <Text style={styles.headerBackButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Meu Perfil ⚙️
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- SECÇÃO: DADOS PESSOAIS --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>

          <Text style={styles.label}>Como gosta de ser chamado?</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Sr. João, Avó Maria..."
            value={localProfile.preferredName}
            onChangeText={(text) =>
              setLocalProfile({ ...localProfile, preferredName: text })
            }
          />

          <Text style={styles.label}>Sua Idade</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 72"
            keyboardType="numeric"
            value={localProfile.age}
            onChangeText={(text) =>
              setLocalProfile({ ...localProfile, age: text })
            }
          />

          <Text style={styles.label}>Telefone de Emergência</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 912 345 678 (Filho/a)"
            keyboardType="phone-pad"
            value={localProfile.emergencyContact}
            onChangeText={(text) =>
              setLocalProfile({ ...localProfile, emergencyContact: text })
            }
          />
        </View>

        {/* --- SECÇÃO: ACESSIBILIDADE --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acessibilidade e Conforto</Text>

          <Text style={styles.label}>Modo de Uso</Text>
          <OptionSelector
            options={[
              { label: "Acessível (Simples)", value: "accessible" },
              { label: "Avançado", value: "advanced" },
            ]}
            selectedValue={localSettings.usageMode}
            onSelect={(val) =>
              setLocalSettings({ ...localSettings, usageMode: val })
            }
          />

          <Text style={styles.label}>Tamanho das Letras</Text>
          <OptionSelector
            options={[
              { label: "Normal", value: "normal" },
              { label: "Grande", value: "large" },
              { label: "Gigante", value: "extra-large" },
            ]}
            selectedValue={localSettings.fontSize}
            onSelect={(val) =>
              setLocalSettings({ ...localSettings, fontSize: val })
            }
          />

          <Text style={styles.label}>Espaço entre os elementos</Text>
          <OptionSelector
            options={[
              { label: "Normal", value: "normal" },
              { label: "Confortável", value: "comfortable" },
            ]}
            selectedValue={localSettings.spacing}
            onSelect={(val) =>
              setLocalSettings({ ...localSettings, spacing: val })
            }
          />

          {/* Opções de Ligar/Desligar (Switches) */}
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Alto Contraste</Text>
              <Text style={styles.switchSubtitle}>
                Cores mais fortes para leitura fácil
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D5DB", true: "#0056D2" }}
              value={localSettings.highContrast}
              onValueChange={(val) =>
                setLocalSettings({ ...localSettings, highContrast: val })
              }
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Reduzir Movimentos</Text>
              <Text style={styles.switchSubtitle}>
                Desliga animações que causam tonturas
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D5DB", true: "#0056D2" }}
              value={localSettings.reduceMotion}
              onValueChange={(val) =>
                setLocalSettings({ ...localSettings, reduceMotion: val })
              }
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Segurança contra Cliques</Text>
              <Text style={styles.switchSubtitle}>
                Evita apagar coisas por engano duplo
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D5DB", true: "#0056D2" }}
              value={localSettings.clickSecurity}
              onValueChange={(val) =>
                setLocalSettings({ ...localSettings, clickSecurity: val })
              }
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Elogios Pessoais</Text>
              <Text style={styles.switchSubtitle}>
                Receba mensagens de motivação
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D5DB", true: "#0056D2" }}
              value={localSettings.enableCompliments}
              onValueChange={(val) =>
                setLocalSettings({ ...localSettings, enableCompliments: val })
              }
            />
          </View>
        </View>

        {/* Botão de Guardar Fixo no Fim */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
  },
  headerBackButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: "#E8F0FE",
    borderRadius: 8,
  },
  headerBackButtonText: { fontSize: 16, color: "#0056D2", fontWeight: "bold" },
  headerTitle: { flex: 1, fontSize: 24, fontWeight: "bold", color: "#1A1A1A" },

  scrollContent: { padding: 20, paddingBottom: 60 },

  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0056D2",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 10,
  },

  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  selectorContainer: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  selectorButtonActive: {
    backgroundColor: "#0056D2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  selectorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
  },
  selectorTextActive: { color: "#FFFFFF" },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  switchTextContainer: { flex: 1, paddingRight: 16 },
  switchTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  switchSubtitle: { fontSize: 14, color: "#666", marginTop: 4 },

  saveButton: {
    backgroundColor: "#137333",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#137333",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  saveButtonText: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold" },
});
