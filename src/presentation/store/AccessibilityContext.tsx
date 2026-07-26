// src/presentation/store/AccessibilityContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

const ACCESSIBILITY_STORAGE_KEY = "@SeniorEase:accessibility";

export interface AccessibilitySettings {
  usageMode: "accessible" | "advanced";
  fontSize: "normal" | "large" | "extra-large";
  highContrast: boolean;
  spacing: "normal" | "comfortable";
  reduceMotion: boolean;
  clickSecurity: boolean;
  enableCompliments: boolean;
}

interface AccessibilityContextData {
  settings: AccessibilitySettings;
  updateSettings: (
    newSettings: Partial<AccessibilitySettings>,
  ) => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: AccessibilitySettings = {
  usageMode: "accessible",
  fontSize: "large",
  highContrast: false,
  spacing: "comfortable",
  reduceMotion: true,
  clickSecurity: true,
  enableCompliments: true,
};

const AccessibilityContext = createContext<AccessibilityContextData>(
  {} as AccessibilityContextData,
);

export const AccessibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [settings, setSettings] =
    useState<AccessibilitySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(
          ACCESSIBILITY_STORAGE_KEY,
        );
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings) as AccessibilitySettings);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar configurações de acessibilidade:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (
    newSettings: Partial<AccessibilitySettings>,
  ) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await AsyncStorage.setItem(
        ACCESSIBILITY_STORAGE_KEY,
        JSON.stringify(updated),
      );
    } catch (error) {
      console.error("Erro ao salvar configurações de acessibilidade:", error);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{ settings, updateSettings, isLoading }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility deve ser usado dentro de um AccessibilityProvider",
    );
  }
  return context;
};
