export function useNotifications() {
  return {
    permissionStatus: "granted",
    requestPermission: async () => true,
  };
}
