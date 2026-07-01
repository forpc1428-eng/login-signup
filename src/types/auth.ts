export type AuthMode = "login" | "signup";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  mobile?: string;
}

export interface AuthFormValues {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

export interface FieldErrorMap {
  fullName?: string;
  email?: string;
  mobile?: string;
  password?: string;
  confirmPassword?: string;
}

export interface BackendResponse<T = unknown> {
  status: "success" | "error";
  code?: string;
  message: string;
  user?: T;
}
