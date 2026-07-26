// src/app/profile.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AccessibilityPanel } from "../presentation/components/ui/AccessibilityPanel";
import { Button } from "../presentation/components/ui/Button";
import { Input } from "../presentation/components/ui/Input";
import { OnboardingTour } from "../presentation/components/ui/OnboardingTour";
import { useAccessibility } from "../presentation/store/AccessibilityContext";
import { useUserProfile } from "../presentation/store/UserProfileContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { settings } = useAccessibility();
  const { profile, updateProfile } = useUserProfile();
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
    primary: isHighContrast ? "#FFD700" : "#0056D2",
    border: isHighContrast ? "#333333" : "#E0E0E0",
  };

  const handleCallEmergency = () => {
    if (!profile.emergencyContact) {
      Alert.alert(
        "Aviso",
        "Por favor, guarde primeiro um número de emergência acima.",
      );
      return;
    }
    Linking.openURL(`tel:${profile.emergencyContact}`);
  };

  // Extrai o primeiro nome para uma saudação mais próxima
  const firstName = profile.preferredName
    ? profile.preferredName.trim().split(" ")[0]
    : "";
  const greetingTitle = firstName
    ? `O seu Espaço, ${firstName}`
    : "O seu Espaço";

  const profileSteps = [
    {
      title: greetingTitle,
      text: "Aqui pode dizer-nos o seu nome e ajustar a aplicação para ficar exatamente como gosta de usar.",
    },
    {
      title: "Acessibilidade",
      text: "Ative o alto contraste para cores mais fortes ou aumente as letras nos botões A, A+ e A++.",
    },
    {
      title: "Segurança Ativa",
      text: "Com a proteção contra cliques ligada, vamos sempre perguntar-lhe duas vezes antes de apagar qualquer coisa importante.",
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
          Perfil e Ajustes
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
        steps={profileSteps}
      />

      <ScrollView contentContainerStyle={{ padding: 20 * sScale }}>
        {/* Painel de Acessibilidade Renderizado Limpamente */}
        <AccessibilityPanel />

        {/* Dados Pessoais e SOS */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { fontSize: 22 * fScale, color: theme.textMain },
            ]}
          >
            Dados Pessoais
          </Text>

          <Input
            label="Como prefere ser chamado(a)?"
            placeholder="O seu nome..."
            value={profile.preferredName}
            onChangeText={(text) => updateProfile({ preferredName: text })}
          />

          <Input
            label="A sua Idade"
            placeholder="Ex: 75"
            value={profile.age}
            onChangeText={(text) => updateProfile({ age: text })}
            keyboardType="numeric"
          />

          <Input
            label="Telefone de Emergência"
            placeholder="Ex: 912345678"
            value={profile.emergencyContact}
            onChangeText={(text) => updateProfile({ emergencyContact: text })}
            keyboardType="phone-pad"
          />

          <Button
            title="Ligar para Emergência (SOS)"
            variant="danger"
            onPress={handleCallEmergency}
            style={{ marginTop: 16 }}
          />
        </View>
      </ScrollView>
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
  card: { padding: 24, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
  sectionTitle: { fontWeight: "bold", marginBottom: 20 },
});
