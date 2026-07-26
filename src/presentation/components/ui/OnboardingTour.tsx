import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface OnboardingTourProps {
  visible: boolean;
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Bem-vindo ao SeniorEase!",
    text: "Criámos este espaço para ser o seu caderno digital. Simples, seguro e fácil de ler.",
  },
  {
    title: "Crie Cadernos",
    text: 'Toque no botão "+" no ecrã inicial para criar separadores para as suas receitas, saúde ou ideias.',
  },
  {
    title: "Use a sua Voz",
    text: "Não gosta de escrever? Dentro de cada caderno, pode usar o microfone para ditar as suas notas.",
  },
  {
    title: "Personalize",
    text: "No separador de Perfil, pode aumentar ainda mais a letra ou ativar o Alto Contraste.",
  },
];

export const OnboardingTour = ({
  visible,
  onComplete,
}: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { settings } = useAccessibility();
  const fScale =
    settings.fontSize === "extra-large"
      ? 1.4
      : settings.fontSize === "large"
        ? 1.2
        : 1;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const step = STEPS[currentStep];

  return (
    <Modal
      visible={visible}
      onClose={onComplete}
      title={`Dica ${currentStep + 1} de ${STEPS.length}`}
    >
      <View style={styles.container}>
        <Text
          style={[
            styles.title,
            {
              fontSize: 24 * fScale,
              color: settings.highContrast ? "#FFD700" : "#0056D2",
            },
          ]}
        >
          {step.title}
        </Text>
        <Text
          style={[
            styles.text,
            {
              fontSize: 18 * fScale,
              color: settings.highContrast ? "#FFFFFF" : "#1A1A1A",
            },
          ]}
        >
          {step.text}
        </Text>

        <View style={styles.footer}>
          <Button
            title={
              currentStep === STEPS.length - 1 ? "Começar a usar!" : "Próximo →"
            }
            onPress={handleNext}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 10 },
  title: { fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  text: { lineHeight: 28, textAlign: "center", marginBottom: 32 },
  footer: { alignItems: "center" },
});
