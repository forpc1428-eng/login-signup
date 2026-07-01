import type { AuthFormValues, FieldErrorMap } from "@/types/auth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function isValidEmail(value: string) {
  return emailPattern.test(value.trim().toLowerCase());
}

export function calculatePasswordStrength(password: string) {
  const value = password ?? "";
  let score = 0;

  if (value.length >= 10) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  const label =
    score <= 1 ? "Weak" : score === 2 ? "Fair" : score === 3 ? "Strong" : "Excellent";

  return {
    score,
    label,
    percent: Math.min(100, score * 25),
  };
}

export function validateSignup(values: AuthFormValues): FieldErrorMap {
  const errors: FieldErrorMap = {};
  const fullName = normalizeText(values.fullName);
  const email = values.email.trim();
  const mobile = values.mobile.trim();
  const password = values.password;
  const confirmPassword = values.confirmPassword;

  if (!fullName) {
    errors.fullName = "Full name is required.";
  } else if (fullName.length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  }

  if (!mobile) {
    errors.mobile = "Mobile number is required.";
  } else if (!/^\d{10}$/.test(mobile)) {
    errors.mobile = "Enter a valid 10-digit phone number.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 10) {
    errors.password = "Use at least 10 characters.";
  } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    errors.password = "Include upper, lower, number, and symbol characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function validateLogin(
  values: Pick<AuthFormValues, "email" | "mobile" | "password">,
  loginMethod: "email" | "mobile",
): FieldErrorMap {
  const errors: FieldErrorMap = {};
  const email = values.email.trim();
  const mobile = values.mobile.trim();
  const password = values.password;

  if (loginMethod === "email") {
    if (!email) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Enter a valid email address.";
    }
  } else {
    if (!mobile) {
      errors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(mobile)) {
      errors.mobile = "Enter a valid 10-digit phone number.";
    }
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return errors;
}
