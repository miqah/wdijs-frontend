import { Platform } from "react-native";
import { handleError } from "../../utils/handleError";
import api from "../api";
import * as FileSystem from "expo-file-system";

interface CreateTranslationProps {
  recordingUri: string;
  languageId: 1;
}
const createTranslation = async ({
  recordingUri,
  languageId,
}: CreateTranslationProps) => {
  try {
    const base64Uri = await FileSystem.readAsStringAsync(recordingUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (!base64Uri) {
      console.error("Something went wrong while unloading the recording");

      return undefined;
    }

    const audioConfig = {
      encoding: Platform.OS === "ios" ? "LINEAR16" : "AMR_WB",
      sampleRateHertz: Platform.OS === "ios" ? 44100 : 16000,
      languageId,
    };

    const endpoint = "/translator/translate";

    const result = await api.post(
      endpoint,
      {
        audio: base64Uri,
        config: audioConfig,
      },
      {
        timeout: 100000,
      }
    );

    return result.data;
  } catch (error) {
    const handledError = handleError(
      error,
      "Something went wrong when uploading the audio."
    );
    throw handledError;
  }
};

export default createTranslation;
