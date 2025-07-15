import { useMutation } from "@tanstack/react-query";
import firebaseSignIn from "../../../api/auth/firebaseSignIn";

const useSignIn = () => {
  return useMutation({
    mutationFn: firebaseSignIn,
  });
};

export default useSignIn;
