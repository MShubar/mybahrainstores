export function now(): number {
  return Date.now();
}

export function withTimestamps<T extends Record<string, unknown>>(
  data: T,
): T & { createdAt: number; updatedAt: number } {
  const timestamp = now();
  return { ...data, createdAt: timestamp, updatedAt: timestamp };
}

export function withUpdatedAt<T extends Record<string, unknown>>(
  data: T,
): T & { updatedAt: number } {
  return { ...data, updatedAt: now() };
}
