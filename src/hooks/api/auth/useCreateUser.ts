import { useMutation } from "@tanstack/react-query";
import createUser from "../../../api/auth/createUser";

const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
  });
};

export default useCreateUser;
