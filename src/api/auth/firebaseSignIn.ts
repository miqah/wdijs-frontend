import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../clients/firebase";
import { handleError } from "../../utils/handleError";

interface Credentials {
  email: string;
  password: string;
}

const firebaseSignIn = async ({ email, password }: Credentials) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (!user.emailVerified) {
      throw new Error("Please verify your email.");
    }

    return user;
  } catch (error: unknown) {
    const handledError = handleError(error, 'Failed to sign in');
    throw handledError;
  }
};

export default firebaseSignIn;
