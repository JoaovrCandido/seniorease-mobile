import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
// Caso já tenha o AsyncStorage configurado para as preferências, vamos preparar a estrutura
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AccessibilitySettings {
  userName: string;
  fontSize: "normal" | "large" | "extra-large";
  highContrast: boolean;
  spacing: "normal" | "comfortable";
  reduceMotion: boolean;
  clickProtection: boolean;
  encouragement: boolean;
  advancedMode: boolean; // <-- NOVO: Modo Avançado
}

interface AccessibilityContextData {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  isLoadingSettings: boolean;
}

const defaultSettings: AccessibilitySettings = {
  userName: "",
  fontSize: "extra-large",
  highContrast: false,
  spacing: "comfortable",
  reduceMotion: false,
  clickProtection: true,
  encouragement: true,
  advancedMode: false,
};

const AccessibilityContext = createContext<AccessibilityContextData>(
  {} as AccessibilityContextData,
);

const SETTINGS_KEY = "@seniorease_settings";

export const AccessibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [settings, setSettings] =
    useState<AccessibilitySettings>(defaultSettings);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Carrega as preferências guardadas assim que a app abre
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
        if (storedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setIsLoadingSettings(false);
      }
    };
    loadSettings();
  }, []);

  // Atualiza o estado e guarda fisicamente no dispositivo
  const updateSettings = async (
    newSettings: Partial<AccessibilitySettings>,
  ) => {
    let updated = { ...settings, ...newSettings };

    // Se o utilizador alternou o Modo Avançado, ajustamos a fonte por default
    if (
      "advancedMode" in newSettings &&
      newSettings.advancedMode !== settings.advancedMode
    ) {
      updated.fontSize = newSettings.advancedMode ? "large" : "extra-large";
    }

    setSettings(updated);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Erro ao guardar configurações:", error);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{ settings, updateSettings, isLoadingSettings }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
