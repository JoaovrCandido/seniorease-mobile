// src/presentation/store/UserProfileContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

const PROFILE_STORAGE_KEY = "@SeniorEase:profile";

export interface UserProfile {
  preferredName: string;
  age: string;
  emergencyContact: string;
}

interface UserProfileContextData {
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
  isLoading: boolean;
}

const defaultProfile: UserProfile = {
  preferredName: "",
  age: "",
  emergencyContact: "",
};

const UserProfileContext = createContext<UserProfileContextData>(
  {} as UserProfileContextData,
);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile) as UserProfile);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil do usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    const updated = { ...profile, ...newProfile };
    setProfile(updated);
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Erro ao salvar perfil do usuário:", error);
    }
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, isLoading }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error(
      "useUserProfile deve ser usado dentro de um UserProfileProvider",
    );
  }
  return context;
};
