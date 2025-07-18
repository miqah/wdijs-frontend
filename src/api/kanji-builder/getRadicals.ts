import { handleError } from "../../utils/handleError";
import api from "../api";

export interface Radical {
  id: string | number;
  name: string;
}

const getRadicals = async () => {
  try {
    console.log("fetching radicals");
    const endpoint = "/kanji-builder/radicals";
    const response = await api.get<Radical[]>(endpoint);
    return response.data;
  } catch (error: unknown) {
    const handeledError = handleError(error, "Failed to get radicals");
    throw handeledError;
  }
};

export default getRadicals;
