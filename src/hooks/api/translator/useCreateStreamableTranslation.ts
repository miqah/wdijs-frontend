import { useState, useCallback } from "react";
import createStreamableTranslation from "../../../api/translator/createStreamableTranslation";

interface StreamingTranslationParams {
  recordingUri: string;
  languageId: number;
  onProgressUpdate: (update: { response?: string; transcription?: string }) => void;
}

interface TranslationResponse {
  response?: string;
  transcription?: string;
}

interface MutationResult {
  isLoading: boolean;
  error: Error | null;
  data: TranslationResponse | null;
  mutate: (
    params: StreamingTranslationParams,
    options?: {
      onSuccess?: (data: TranslationResponse) => void;
      onError?: (error: Error) => void;
    }
  ) => Promise<void>;
}

const useCreateStreamableTranslation = (): MutationResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TranslationResponse | null>(null);

  const mutate = useCallback(
    async (
      params: StreamingTranslationParams,
      options?: {
        onSuccess?: (data: TranslationResponse) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        // Create a compatibility wrapper for the onProgressUpdate function
        // to handle both old-style string updates and new object updates
        const wrappedOnProgressUpdate = (update: string | { response?: string; transcription?: string }) => {
          if (typeof update === 'string') {
            // Legacy string format - assume it's transcription
            params.onProgressUpdate({ transcription: update });
          } else {
            // New object format
            params.onProgressUpdate(update);
          }
        };

        // Pass the wrapped callback to createStreamableTranslation
        const result = await createStreamableTranslation({
          ...params,
          onProgressUpdate: wrappedOnProgressUpdate as any, // Cast needed for compatibility
        });

        console.log('Final translation result:', JSON.stringify(result));
        setData(result);
        setIsLoading(false);
        options?.onSuccess?.(result);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        console.error('Translation error:', errorObj);
        setError(errorObj);
        setIsLoading(false);
        options?.onError?.(errorObj);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    data,
    mutate,
  };
};

export default useCreateStreamableTranslation;
