import { auth } from "../clients/firebase";

const getToken = async () => {
  try {
    const token = await auth.currentUser.getIdToken()
    return token;
  } catch (error) {
    console.error("Failed to retrieve token", error);
    return null;
  }
};

export default getToken;
