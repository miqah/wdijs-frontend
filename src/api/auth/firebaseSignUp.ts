import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../clients/firebase";
import { handleError } from "../../utils/handleError";

interface Credentials {
  email: string;
  password: string;
}

const firebaseSignUp = async ({ email, password }: Credentials) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.toLowerCase(),
      password
    );
    const user = userCredential.user;

    return user;
  } catch (error: unknown) {
    const handledError = handleError(error, "Failed to sign up");
    throw handledError;
  }
};

export default firebaseSignUp;
