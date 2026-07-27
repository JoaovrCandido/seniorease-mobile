import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const SETTINGS_STORAGE_KEY = "@SeniorEase:settings";
const PROFILE_STORAGE_KEY = "@SeniorEase:profile";

export interface UserProfile {
  preferredName: string;
  age: string;
  emergencyContact: string;
}

export interface AccessibilitySettings {
  usageMode: "accessible" | "advanced";
  fontSize: "normal" | "large" | "extra-large";
  highContrast: boolean;
  spacing: "normal" | "comfortable";
  reduceMotion: boolean;
  clickSecurity: boolean;
  enableCompliments: boolean;
}

interface SettingsContextData {
  profile: UserProfile;
  settings: AccessibilitySettings;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
  updateSettings: (
    newSettings: Partial<AccessibilitySettings>,
  ) => Promise<void>;
  isLoadingSettings: boolean;
}

const defaultProfile: UserProfile = {
  preferredName: "",
  age: "",
  emergencyContact: "",
};

const defaultSettings: AccessibilitySettings = {
  usageMode: "accessible",
  fontSize: "large",
  highContrast: false,
  spacing: "comfortable",
  reduceMotion: true,
  clickSecurity: true,
  enableCompliments: true,
};

const SettingsContext = createContext<SettingsContextData>(
  {} as SettingsContextData,
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [settings, setSettings] =
    useState<AccessibilitySettings>(defaultSettings);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);

        if (storedProfile) setProfile(JSON.parse(storedProfile) as UserProfile);
        if (storedSettings)
          setSettings(JSON.parse(storedSettings) as AccessibilitySettings);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadData();
  }, []);

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    const updated = { ...profile, ...newProfile };
    setProfile(updated);
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
  };

  const updateSettings = async (
    newSettings: Partial<AccessibilitySettings>,
  ) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <SettingsContext.Provider
      value={{
        profile,
        settings,
        updateProfile,
        updateSettings,
        isLoadingSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings deve ser usado dentro de um SettingsProvider");
  }
  return context;
};
