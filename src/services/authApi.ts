import type { BackendResponse } from "@/types/auth";

export class ApiError extends Error {
  code: string;

  constructor(message: string, code = "API_ERROR") {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

type AuthAction = "login" | "signup";

interface AuthPayload {
  action: AuthAction;
  fullName?: string;
  email?: string;
  mobile?: string;
  password: string;
  confirmPassword?: string;
}

interface BackendUser {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  mobile?: string;
}

const ENDPOINT = import.meta.env.VITE_APPS_SCRIPT_URL?.trim() ?? "";
const REQUEST_TIMEOUT_MS = 20000;

function readEndpoint() {
  if (!ENDPOINT) {
    throw new ApiError("Configure VITE_APPS_SCRIPT_URL before using authentication.", "MISSING_ENDPOINT");
  }

  return ENDPOINT;
}

async function safeParseResponse(text: string): Promise<BackendResponse<BackendUser>> {
  try {
    const parsed = JSON.parse(text) as BackendResponse<BackendUser>;
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid payload");
    }

    return parsed;
  } catch {
    throw new ApiError("The backend returned an invalid response.", "INVALID_JSON");
  }
}

async function sendRequest(payload: AuthPayload): Promise<BackendUser> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(readEndpoint(), {
      method: "POST",
      mode: "cors",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const text = await response.text();
    const data = await safeParseResponse(text);

    if (data.status !== "success") {
      throw new ApiError(data.message || "Authentication failed.", data.code || "AUTH_FAILED");
    }

    if (!data.user || typeof data.user !== "object") {
      throw new ApiError("The backend did not return a user record.", "MALFORMED_RESPONSE");
    }

    return data.user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("The request timed out. Please try again.", "TIMEOUT");
    }

    if (error instanceof TypeError) {
      throw new ApiError("Network failure. Check your connection and backend URL.", "NETWORK_ERROR");
    }

    throw new ApiError("Authentication request failed unexpectedly.", "UNKNOWN_ERROR");
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function signupUser(input: Omit<AuthPayload, "action">) {
  return sendRequest({ action: "signup", ...input });
}

export async function loginUser(input: Omit<AuthPayload, "action" | "fullName" | "confirmPassword">) {
  return sendRequest({ action: "login", ...input });
}
