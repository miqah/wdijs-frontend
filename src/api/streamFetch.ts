import getToken from '../utils/authUtils';
import { fetch } from 'expo/fetch';

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL

export async function streamFetch(
  url: string,
  options: RequestInit = {},
  onChunk: (chunk: string) => void
) {
  try {
    const token = await getToken();
    
    const headers = {
      Accept: 'text/event-stream',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    
    const fetchOptions: RequestInit = {
      ...options,
      headers,
    };
    
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    console.log(`Making request to: ${fullUrl}`);
    
    const response = await fetch(fullUrl, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Readable stream not supported");
    
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    
    while (true) {
      const { value, done } = await reader.read();
      
      if (done) {
        console.log("Stream complete");
        break;
      }
      
      // Decode the chunk and add to buffer
      const textChunk = decoder.decode(value, { stream: true });
      console.log("Received chunk:", textChunk);
      buffer += textChunk;
      
      // Process complete SSE events
      let eventEnd = buffer.indexOf("\n\n");
      
      while (eventEnd !== -1) {
        const event = buffer.substring(0, eventEnd).trim();
        buffer = buffer.substring(eventEnd + 2);
        
        // Parse the event
        const lines = event.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data:")) {
            const data = line.substring(5).trim();
            console.log("Extracted data:", data);
            onChunk(data);
          }
        }
        
        eventEnd = buffer.indexOf("\n\n");
      }
    }
    
    // Process any remaining complete events in buffer
    if (buffer.trim()) {
      const lines = buffer.trim().split("\n");
      
      for (const line of lines) {
        if (line.startsWith("data:")) {
          const data = line.substring(5).trim();
          console.log("Final data:", data);
          onChunk(data);
        }
      }
    }
    
  } catch (error) {
    console.error("Stream fetch error:", error);
    throw error;
  }
}