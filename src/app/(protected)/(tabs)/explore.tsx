import { Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../../context/authContext";

export default function TabTwoScreen() {
  const { signOut } = useAuth();

  return (
    <TouchableOpacity onPress={signOut}>
      <Text>hey</Text>
    </TouchableOpacity>
  );
}
