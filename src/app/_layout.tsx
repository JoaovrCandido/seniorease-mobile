// src/app/_layout.tsx
import { Stack } from "expo-router";
import { NotebookProvider } from "../presentation/store/NotebookContext";
import { SettingsProvider } from "../presentation/store/SettingsContext";

export default function RootLayout() {
  return (
    <SettingsProvider>
      <NotebookProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          {/* O expo-router descobre as outras rotas automaticamente */}
        </Stack>
      </NotebookProvider>
    </SettingsProvider>
  );
}
