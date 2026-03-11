export type AppErrorCode = "NETWORK" | "VALIDATION" | "AI_TIMEOUT" | "UNKNOWN";

export interface AppError {
  code: AppErrorCode;
  title: string;
  message: string;
  recoverable: boolean;
}

export function mapError(error: unknown): AppError {
  if (error instanceof Error && error.message.includes("timeout")) {
    return {
      code: "AI_TIMEOUT",
      title: "AI request timeout",
      message: "Please retry. The service took too long to respond.",
      recoverable: true
    };
  }

  if (error instanceof TypeError) {
    return {
      code: "NETWORK",
      title: "Network unavailable",
      message: "Please check your connection and try again.",
      recoverable: true
    };
  }

  return {
    code: "UNKNOWN",
    title: "Unexpected error",
    message: "An unexpected error occurred. Please try again.",
    recoverable: true
  };
}
