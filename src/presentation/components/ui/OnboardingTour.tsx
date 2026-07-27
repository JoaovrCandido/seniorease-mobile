import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { useAccessibility } from "../../store/AccessibilityContext";
import { Button } from "./Button";

export interface TourStep {
  title: string;
  text: string;
}

interface OnboardingTourProps {
  visible: boolean;
  onComplete: () => void;
  steps: TourStep[];
}

export const OnboardingTour = ({
  visible,
  onComplete,
  steps,
}: OnboardingTourProps) => {
  const { settings } = useAccessibility();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (visible) setCurrentStep(0);
  }, [visible]);

  if (!visible || !steps || steps.length === 0) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const fScale =
    settings.fontSize === "extra-large"
      ? 1.4
      : settings.fontSize === "large"
        ? 1.2
        : 1;
  const sScale = settings.spacing === "comfortable" ? 1.5 : 1;
  const isHighContrast = settings.highContrast;

  const theme = {
    bg: "rgba(0, 0, 0, 0.8)",
    card: isHighContrast ? "#1E1E1E" : "#FFFFFF",
    textMain: isHighContrast ? "#FFFFFF" : "#1A1A1A",
    textSub: isHighContrast ? "#BBBBBB" : "#666666",
  };

  const handleNext = () => {
    if (isLast) onComplete();
    else setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onComplete}
    >
      <View style={[styles.overlay, { backgroundColor: theme.bg }]}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, padding: 24 * sScale },
          ]}
        >
          <Text
            style={{
              fontSize: 24 * fScale,
              fontWeight: "bold",
              color: theme.textMain,
              marginBottom: 12 * sScale,
            }}
          >
            {step.title}
          </Text>
          <Text
            style={{
              fontSize: 18 * fScale,
              color: theme.textSub,
              marginBottom: 24 * sScale,
              lineHeight: 26 * fScale,
            }}
          >
            {step.text}
          </Text>

          <View style={styles.footer}>
            <Text
              style={{
                fontSize: 16 * fScale,
                color: theme.textSub,
                fontWeight: "bold",
                marginBottom: 16 * sScale,
                textAlign: "center",
              }}
            >
              Dica {currentStep + 1} de {steps.length}
            </Text>

            <View style={styles.actions}>
              {currentStep > 0 && (
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Button
                    title="Voltar"
                    variant="secondary"
                    onPress={handlePrev}
                  />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Button
                  title={isLast ? "Entendi!" : "Próximo"}
                  onPress={handleNext}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: { width: "100%", borderRadius: 16, elevation: 5 },
  footer: { flexDirection: "column" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
