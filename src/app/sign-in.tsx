import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import Input from "../components/Input/Input";
import { useAuth } from "../context/authContext";
import { useRouter } from "expo-router";

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const onSubmit = (data: SignInFormData) => {
    signIn({ email: data.email, password: data.password });
  };

  const { isLoggedIn, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/(protected)/(tabs)");
    }
  }, [isLoggedIn, router]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Different behavior for iOS and Android
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.header}>Sign In</Text>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter your email"
                error={errors.email?.message?.toString()}
              />
            )}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/i,
                message: "Invalid email address",
              },
            }}
            defaultValue=""
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                placeholder="Enter your password"
                error={errors.password?.message?.toString()}
              />
            )}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            defaultValue=""
          />

          <Button title="Sign In" onPress={handleSubmit(onSubmit)} />

          {/* Link to Sign Up screen */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Don&apos;t have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/sign-up")}>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    fontSize: 16,
  },
  link: {
    fontSize: 16,
    color: "#007BFF", // Blue color for the link
    textDecorationLine: "underline",
  },
});

export default SignIn;
