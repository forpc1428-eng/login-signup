import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { AuthFormValues, AuthMode, FieldErrorMap } from "@/types/auth";
import { FloatingField } from "@/components/FloatingField";
import { MessageBanner } from "@/components/MessageBanner";
import SpotlightCard from "@/components/SpotlightCard";

type LoginMethod = "email" | "mobile";

interface AuthPanelProps {
  mode: AuthMode;
  loginMethod: LoginMethod;
  values: AuthFormValues;
  errors: FieldErrorMap;
  touched: Partial<Record<keyof AuthFormValues, boolean>>;
  loading: boolean;
  status: { tone: "error" | "success" | "info"; message: string } | null;
  onChange: (field: keyof AuthFormValues, value: string) => void;
  onBlur: (field: keyof AuthFormValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onToggleMode: () => void;
  onToggleLoginMethod: () => void;
}

function PasswordRevealButton({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg px-2 py-1 text-[11px] font-medium uppercase tracking-[0.3em] text-white/45 transition hover:text-white"
    >
      {visible ? "Hide" : "Show"}
    </button>
  );
}

export function AuthPanel({
  mode,
  loginMethod,
  values,
  errors,
  touched,
  loading,
  status,
  onChange,
  onBlur,
  onSubmit,
  onToggleMode,
  onToggleLoginMethod,
}: AuthPanelProps) {
  const [revealPassword, setRevealPassword] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setRevealPassword(false);
  }, [mode]);

  const submitLabel = mode === "signup" ? "Create account" : "Sign in";
  const secondaryAction = mode === "signup" ? "Sign in" : "Sign up";
  const loadingLabel = mode === "signup" ? "Creating account" : "Signing in";

  return (
    <SpotlightCard
      spotlightColor="rgba(75, 99, 233, 0.16)"
      className="w-full max-w-sm rounded-[28px] border border-white/10 bg-white/[0.05] p-2.5 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:max-w-md sm:p-4"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {mode === "signup" ? "Create account" : "Sign in"}
          </h2>
        </div>
        <div className="ml-auto flex items-center gap-2.5 sm:ml-0">
          <button
            type="button"
            onClick={onToggleMode}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 transition hover:border-violet-400/40 hover:text-white sm:px-3 sm:text-[11px]"
          >
            {secondaryAction}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status ? <MessageBanner key={status.message} tone={status.tone} message={status.message} /> : null}
      </AnimatePresence>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <AnimatePresence mode="wait" initial={false}>
          {mode === "signup" ? (
            <motion.div
              key="signup-fields"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <FloatingField
                label="Full name"
                value={values.fullName}
                onChange={(event) => onChange("fullName", event.target.value)}
                onBlur={() => onBlur("fullName")}
                autoComplete="name"
                error={touched.fullName ? errors.fullName : undefined}
              />
              <FloatingField
                label="Email address"
                type="email"
                value={values.email}
                onChange={(event) => onChange("email", event.target.value)}
                onBlur={() => onBlur("email")}
                autoComplete="email"
                error={touched.email ? errors.email : undefined}
              />
              <FloatingField
                label=""
                value={values.mobile}
                onChange={(event) => onChange("mobile", event.target.value)}
                onBlur={() => onBlur("mobile")}
                autoComplete="tel"
                placeholder="Mobile number"
                inputMode="numeric"
                prefix="+91"
                error={touched.mobile ? errors.mobile : undefined}
              />
              <FloatingField
                label="Password"
                type={revealPassword ? "text" : "password"}
                value={values.password}
                onChange={(event) => onChange("password", event.target.value)}
                onBlur={() => onBlur("password")}
                autoComplete="new-password"
                error={touched.password ? errors.password : undefined}
                suffix={<PasswordRevealButton visible={revealPassword} onClick={() => setRevealPassword((current) => !current)} />}
              />
              <FloatingField
                label="Confirm password"
                type={revealPassword ? "text" : "password"}
                value={values.confirmPassword}
                onChange={(event) => onChange("confirmPassword", event.target.value)}
                onBlur={() => onBlur("confirmPassword")}
                autoComplete="new-password"
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
              />
            </motion.div>
          ) : (
            <motion.div
              key="login-fields"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {loginMethod === "email" ? (
                <FloatingField
                  label="Email address"
                  type="email"
                  value={values.email}
                  onChange={(event) => onChange("email", event.target.value)}
                  onBlur={() => onBlur("email")}
                  autoComplete="email"
                  error={touched.email ? errors.email : undefined}
                  suffix={
                    <button
                      type="button"
                      onClick={onToggleLoginMethod}
                      className="rounded-lg px-2 py-1 text-[11px] font-medium uppercase tracking-[0.3em] text-white/45 transition hover:text-white"
                    >
                      Phone
                    </button>
                  }
                />
              ) : (
                <FloatingField
                  label=""
                  value={values.mobile}
                  onChange={(event) => onChange("mobile", event.target.value)}
                  onBlur={() => onBlur("mobile")}
                  autoComplete="tel"
                  placeholder="Mobile number"
                  inputMode="numeric"
                  prefix="+91"
                  suffix={
                    <button
                      type="button"
                      onClick={onToggleLoginMethod}
                      className="rounded-lg px-2 py-1 text-[11px] font-medium uppercase tracking-[0.3em] text-white/45 transition hover:text-white"
                    >
                      Email
                    </button>
                  }
                  error={touched.mobile ? errors.mobile : undefined}
                />
              )}
              <FloatingField
                label="Password"
                type={revealPassword ? "text" : "password"}
                value={values.password}
                onChange={(event) => onChange("password", event.target.value)}
                onBlur={() => onBlur("password")}
                autoComplete="current-password"
                error={touched.password ? errors.password : undefined}
                suffix={<PasswordRevealButton visible={revealPassword} onClick={() => setRevealPassword((current) => !current)} />}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          layout
          type="submit"
          disabled={loading}
          whileHover={loading ? undefined : { scale: 1.01 }}
          whileTap={loading ? undefined : { scale: 0.99 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="group relative flex h-11 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(124,92,255,0.28)] transition disabled:cursor-not-allowed disabled:opacity-80 sm:h-12 sm:px-5"
        >
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_58%)] opacity-0 transition group-hover:opacity-100" />
          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="relative flex items-center gap-3"
              >
                <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                {loadingLabel}
              </motion.span>
            ) : (
              <motion.span
                key="ready"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="relative"
              >
                {submitLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

      </form>
    </SpotlightCard>
  );
}
