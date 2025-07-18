import { streamFetch } from "../streamFetch";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

interface CreateTranslationProps {
  recordingUri: string;
  languageId: number;
  onProgressUpdate: (update: { response?: string; transcription?: string }) => void;
}

interface TranslationResponse {
  response?: string;    // The recognized text
  transcription?: string; // The translation
}

const createStreamableTranslation = async ({
  recordingUri,
  languageId,
  onProgressUpdate,
}: CreateTranslationProps): Promise<TranslationResponse> => {
  try {
    console.log('Starting streamable translation...');
    
    const base64Uri = await FileSystem.readAsStringAsync(recordingUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    if (!base64Uri) {
      console.error("Failed to read recording file");
      throw new Error("Failed to read recording file");
    }
    
    console.log('Audio file read successfully, size:', base64Uri.length);
    
    const audioConfig = {
      encoding: Platform.OS === "ios" ? "LINEAR16" : "AMR_WB",
      sampleRateHertz: Platform.OS === "ios" ? 44100 : 16000,
      languageId,
    };
    
    // Use the streaming endpoint
    const endpoint = "/translator/translate";
    
    const requestBody = JSON.stringify({
      audio: base64Uri,
      config: audioConfig,
    });
    
    // Result object to return
    const finalResult: TranslationResponse = {
      response: "",
      transcription: "",
    };
    
    console.log('Sending request to streaming endpoint...');
    
    // Create a function to process each chunk
    const handleChunk = (chunk: string) => {
      console.log('Processing chunk:', chunk.substring(0, 50) + '...');
      
      try {
        // Try to parse as JSON
        const parsedChunk = JSON.parse(chunk);
        const update: { response?: string; transcription?: string } = {};
        
        // Add response to update if present
        if (parsedChunk.response) {
          finalResult.response = parsedChunk.response;
          update.response = parsedChunk.response;
        }
        
        // Add transcription to update if present
        if (parsedChunk.transcription) {
          finalResult.transcription = parsedChunk.transcription;
          update.transcription = parsedChunk.transcription;
        }
        
        // Call onProgressUpdate with the update object
        if (update.response || update.transcription) {
          onProgressUpdate(update);
        } else {
          // If no recognized fields, pass the whole chunk
          onProgressUpdate({ transcription: JSON.stringify(parsedChunk) });
        }
      } catch (error) {
        // If not valid JSON, use as raw text
        console.log("Non-JSON chunk, using as raw text:", chunk);
        onProgressUpdate({ transcription: chunk });
      }
    };
    
    // Use streamFetch for the request
    await streamFetch(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      },
      handleChunk
    );
    
    console.log('Streaming translation complete');
    
    return finalResult;
  } catch (error) {
    console.error("Error in streamable translation:", error);
    throw error;
  }
};

export default createStreamableTranslation;