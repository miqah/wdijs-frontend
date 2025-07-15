import { Redirect, Stack, useRouter } from "expo-router";
import { useAuth } from "../../context/authContext";
import CustomHeader from "../../components/CustomHeader/CustomHeader";

export default function ProtectedLayout() {
  const { isLoggedIn, isReady } = useAuth();
  const router = useRouter();

  if (!isReady) {
    return null;
  }

  if (!isLoggedIn) return <Redirect href="/sign-in" />;

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          header: () => (
            <CustomHeader
              onProfilePress={() => {}}
              onSettingsPress={() => {
                router.push("/settings");
              }}
            />
          ),
        }}
      />
    </Stack>
  );
}
