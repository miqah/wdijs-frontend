import { Text, StyleSheet, Pressable } from "react-native";

interface ButtonProps {
  text: string;
  handlePress: () => void;
  isDisabled?: boolean;
}

export default function Button({ text, handlePress, isDisabled }: ButtonProps) {
  return (
    <Pressable
      onPress={isDisabled ? undefined : handlePress}
      style={[styles.button, isDisabled && styles.buttonDisabled]}
    >
      <Text
        style={[styles.buttonText, isDisabled && styles.buttonTextDisabled]}
      >
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 260,
    backgroundColor: "blue",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextDisabled: {
    color: "darkgray",
  },
});
