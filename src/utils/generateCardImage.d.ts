import type { AuthUser } from "@/types/auth";

export function generateCardImage(
  user: AuthUser,
  side?: "front" | "back"
): Promise<string>;
