export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message.trim().toLowerCase();
  if (
    message.includes("server error") ||
    message.includes("invalidsecret") ||
    message.includes("invalid account") ||
    message.includes("invalid credentials")
  ) {
    return "Invalid email or password.";
  }

  return error.message || fallback;
}
