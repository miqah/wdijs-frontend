import { SplashScreen, useRouter } from "expo-router";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSignIn from "../hooks/api/auth/useSignIn";
import useSignUp from "../hooks/api/auth/useSignUp";
import useCreateUser from "../hooks/api/auth/useCreateUser";
import { sendEmailVerification } from "firebase/auth";

SplashScreen.preventAutoHideAsync();

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  signIn: (credentials: { email: string; password: string }) => void;
  signUp: (credentials: { email: string; password: string }) => void;
  signOut: () => void;
};
const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const { mutate: signInMutation } = useSignIn();
  const { mutate: signUpMutation } = useSignUp();
  const { mutate: createMutation } = useCreateUser();

  const router = useRouter();
  const authStorageKey = "auth-storage-key";

  // TODO: explore using current user instead of storing authToken here
  const storeAuthState = async (newState: {
    isLoggedIn: boolean;
    authToken: string | null;
  }) => {
    try {
      const jsonValue = JSON.stringify(newState);

      await AsyncStorage.setItem(authStorageKey, jsonValue);
    } catch (error) {
      console.log("Error saving token", error);
    }
  };

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    signInMutation(
      { email, password },
      {
        onSuccess: async (user) => {
          const idToken = await user.getIdToken();
          setIsLoggedIn(true);
          storeAuthState({ isLoggedIn: true, authToken: idToken });
          router.replace("/(protected)/(tabs)");
        },
        onError: (error) => {
          console.error("Sign In Failed", error);
        },
      }
    );
  };

  const signUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    signUpMutation(
      { email, password },
      {
        onSuccess: async (userCredential) => {
          const user = userCredential;

          // Step 1: Create user in the database first
          try {
            await createMutation(
              { email },
              {
                onSuccess: async (data) => {
                  console.log("User created successfully in database:", data);

                  // Step 2: Send email verification to the user after database creation
                  try {
                    await sendEmailVerification(user);
                    const idToken = await user.getIdToken();

                    // Step 3: Update state and store auth status
                    setIsLoggedIn(false);
                    storeAuthState({ isLoggedIn: false, authToken: idToken });

                    router.replace("/sign-in");
                  } catch (error) {
                    console.error("Failed to send email verification:", error);
                  }
                },
                onError: (error) => {
                  console.error("Failed to create user in database:", error);
                },
              }
            );
          } catch (error) {
            console.error("Failed to create user in the database:", error);
          }
        },
        onError: (error) => {
          console.error("Sign Up Failed", error);
        },
      }
    );
  };

  const signOut = () => {
    setIsLoggedIn(false);
    storeAuthState({ isLoggedIn: false, authToken: null });
    router.replace("/sign-in");
  };

  // TODO: incorporate onAuthStateChanged
  useEffect(() => {
    const getAuthFromStorage = async () => {
      try {
        const value = await AsyncStorage.getItem(authStorageKey);

        if (value !== null) {
          const auth = JSON.parse(value);
          setIsLoggedIn(auth.isLoggedIn);
        }
      } catch (error) {
        console.log("Error getting initial auth storage value", error);
      }

      setIsReady(true);
    };

    getAuthFromStorage();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, signIn, signOut, isReady, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
