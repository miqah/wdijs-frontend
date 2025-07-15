import React, { useState } from "react";
import {
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Input from "../../../components/Input/Input";

export default function HomeScreen() {
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    console.log("Sent message:", message);
    setMessage("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.bottom}
    >
      <Input
        label="Message"
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message..."
        onBlur={() => setTouched(true)}
        style={styles.textBox}
      />
      <Button title="Send" onPress={handleSend} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  textBox: {
    minHeight: 80,
  },
});
