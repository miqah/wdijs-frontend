import { useMutation } from "@tanstack/react-query";
import firebaseSignUp from "../../api/auth/firebaseSignUp";

const useSignUp = () => {
  return useMutation({
    mutationFn: firebaseSignUp,
  });
};

export default useSignUp;
