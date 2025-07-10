export function handleError(error: unknown, customMessage: string = ""): Error {
  let errorMessage = customMessage || "An unexpected error occurred";

  if (error instanceof Error) {
    // Standard error with message
    console.error(`Error: ${error.message}`);
    errorMessage = error.message; // Set user-facing error message
  } else {
    // Handle non-Error objects (such as network errors)
    console.error(`Unexpected error: ${error}`);
  }

  // Show the error to the user (could be a toast, modal, alert, etc.)
  // Example: Using alert for demonstration purposes
  alert(errorMessage);

  // Return the error object so it can be rethrown or handled further
  return new Error(errorMessage); // Returning a new Error with the message
}
