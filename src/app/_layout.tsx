import { ToastProvider } from "@/presentation/store/ToastContext";
import { Stack } from "expo-router";
import { AccessibilityProvider } from "../presentation/store/AccessibilityContext";
import { NotebookProvider } from "../presentation/store/NotebookContext";
import { UserProfileProvider } from "../presentation/store/UserProfileContext";

export default function RootLayout() {
  return (
    <AccessibilityProvider>
      <UserProfileProvider>
        <ToastProvider>
          <NotebookProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
            </Stack>
          </NotebookProvider>
        </ToastProvider>
      </UserProfileProvider>
    </AccessibilityProvider>
  );
}
