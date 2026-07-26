// src/presentation/store/ToastContext.tsx
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from "react";
import { StyleSheet, Text, View } from "react-native";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextData {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message, type });

    // O aviso some automaticamente após 3 segundos
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <View
          style={[styles.toastContainer, styles[toast.type]]}
          pointerEvents="none"
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999, // Garante que fica por cima de modais e listas
  },
  success: { backgroundColor: "#137333" },
  error: { backgroundColor: "#D93025" },
  info: { backgroundColor: "#0056D2" },
  toastText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
