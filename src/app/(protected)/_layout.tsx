import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/authContext";

export default function ProtectedLayout() {
  const { isLoggedIn, isReady } = useAuth();

  if (!isReady) {
    return null;
  }

  if (!isLoggedIn) return <Redirect href="/sign-in" />;

  console.log()
  return (
    <Stack>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
