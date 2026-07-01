import { useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AuthPanel } from "@/components/AuthPanel";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Lanyard3D } from "@/components/Lanyard3D";
import SideRays from "@/components/SideRays";
import { loginUser, signupUser, ApiError } from "@/services/authApi";
import { useAuthSession } from "@/hooks/useAuthSession";
import type { AuthFormValues, AuthMode, FieldErrorMap } from "@/types/auth";
import { validateLogin, validateSignup } from "@/utils/validation";

const initialValues: AuthFormValues = {
  fullName: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
};

const touchedTemplate: Partial<Record<keyof AuthFormValues, boolean>> = {
  fullName: false,
  email: false,
  mobile: false,
  password: false,
  confirmPassword: false,
};

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("email");
  const [values, setValues] = useState<AuthFormValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof AuthFormValues, boolean>>>(touchedTemplate);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});
  const [status, setStatus] = useState<{ tone: "error" | "success" | "info"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, ready, setUser, clearUser } = useAuthSession();

  const validationErrors = useMemo(
    () => (mode === "signup" ? validateSignup(values) : validateLogin(values, loginMethod)),
    [mode, values, loginMethod],
  );

  const displayErrors = useMemo(
    () => ({ ...validationErrors, ...fieldErrors }),
    [fieldErrors, validationErrors],
  );

  const updateField = (field: keyof AuthFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus(null);

    if (fieldErrors[field]) {
      setFieldErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const touchField = (field: keyof AuthFormValues) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const resetTouched = () => {
    setTouched({ ...touchedTemplate });
  };

  const switchMode = () => {
    setMode((current) => (current === "login" ? "signup" : "login"));
    setLoginMethod("email");
    setStatus(null);
    setFieldErrors({});
    resetTouched();
  };

  const toggleLoginMethod = () => {
    setLoginMethod((current) => (current === "email" ? "mobile" : "email"));
    setFieldErrors({});
    setStatus(null);
    resetTouched();
  };

  const handleSuccess = (nextUser: { id: string; fullName: string; email: string; createdAt: string }) => {
    setUser(nextUser);
    setLoading(false);
    setFieldErrors({});
    setTouched({ ...touchedTemplate });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    const nextTouched: Partial<Record<keyof AuthFormValues, boolean>> = {
      fullName: true,
      email: true,
      mobile: true,
      password: true,
      confirmPassword: true,
    };
    setTouched(nextTouched);

    const errors = mode === "signup" ? validateSignup(values) : validateLogin(values, loginMethod);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setStatus({ tone: "error", message: "Please correct the highlighted fields." });
      return;
    }

    try {
      setLoading(true);

      if (mode === "signup") {
        await signupUser({
          fullName: values.fullName,
          email: values.email,
          mobile: values.mobile,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });

        setStatus({ tone: "success", message: "Account created. Log in to unlock your badge." });
        setValues((current) => ({
          ...current,
          password: "",
          confirmPassword: "",
        }));
        setMode("login");
        resetTouched();
        return;
      }

      const signedInUser = await loginUser(
        loginMethod === "email"
          ? { email: values.email, password: values.password }
          : { mobile: values.mobile, password: values.password },
      );

      handleSuccess(signedInUser);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === "DUPLICATE_EMAIL") {
          setFieldErrors((current) => ({ ...current, email: error.message }));
        } else if (error.code === "INVALID_CREDENTIALS") {
          setFieldErrors((current) => ({ ...current, password: error.message }));
        } else if (error.code === "INVALID_EMAIL") {
          setFieldErrors((current) => ({ ...current, email: error.message }));
        } else if (error.code === "WEAK_PASSWORD") {
          setFieldErrors((current) => ({ ...current, password: error.message }));
        } else {
          setStatus({ tone: "error", message: error.message });
        }
      } else {
        setStatus({ tone: "error", message: "Unable to complete the request right now." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearUser();
    setValues((current) => ({
      ...current,
      password: "",
      confirmPassword: "",
    }));
    setFieldErrors({});
    setStatus(null);
    resetTouched();
    setMode("login");
  };

  if (!ready) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0E0E11] px-4 text-white">
        <div className="pointer-events-none absolute inset-0 z-0">
          <AnimatedBackground />
          <div className="absolute inset-0">
            <SideRays
              speed={2.0}
              rayColor1="#f3192b"
              rayColor2="#ED54A8"
              intensity={1.5}
              spread={2.4}
              origin="top-right"
              tilt={0}
              saturation={1.2}
              blend={0.7}
              falloff={1.8}
              opacity={0.99}
            />
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 backdrop-blur-xl">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-violet-400" />
          <p className="text-sm text-white/72">Preparing secure session</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0E0E11] text-white">
      <div className="pointer-events-none absolute inset-0 z-0">
        <AnimatedBackground />
        <div className="absolute inset-0">
          <SideRays
            speed={2.0}
            rayColor1="#F02D3D"
            rayColor2="#ED54A8"
            intensity={1.8}
            spread={1.8}
            origin="top-right"
            tilt={0}
            saturation={1.2}
            blend={0.7}
            falloff={1.8}
            opacity={0.95}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-center">
          <AnimatePresence mode="wait">
            {user ? (
              <div key="lanyard-3d" className="relative w-full">
                <Lanyard3D user={user} onLogout={handleLogout} />
              </div>
            ) : (
              <AuthPanel
                key="auth"
                mode={mode}
                loginMethod={loginMethod}
                values={values}
                errors={displayErrors}
                touched={touched}
                loading={loading}
                status={status}
                onChange={updateField}
                onBlur={touchField}
                onSubmit={handleSubmit}
                onToggleMode={switchMode}
                onToggleLoginMethod={toggleLoginMethod}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
