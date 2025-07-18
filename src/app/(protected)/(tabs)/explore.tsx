import { Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../../context/authContext";

export default function ExploreScreen() {
  const { signOut } = useAuth();

  return (
    <TouchableOpacity onPress={signOut}>
      <Text>Sign Out</Text>
    </TouchableOpacity>
  );
}
