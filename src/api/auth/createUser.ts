import { handleError } from "../../utils/handleError";
import api from "../api";

const createUser = async ({ email }: { email: string }) => {
  try {
    const endpoint = "/auth/sign-up";

    const response = await api.post(endpoint, {
      email: email.toLowerCase(),
    });

    return response.data;
  } catch (error: unknown) {
    const handledError = handleError(error, "Failed to create user");
    throw handledError;
  }
};

export default createUser;
