import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface FloatingFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  suffix?: ReactNode;
  prefix?: ReactNode;
}

export const FloatingField = forwardRef<HTMLInputElement, FloatingFieldProps>(function FloatingField(
  { className, label, error, id, suffix, prefix, placeholder, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const hasValue = typeof props.value === "string" ? props.value.length > 0 : Boolean(props.value);

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <div className="relative">
          {prefix ? <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-white/60">{prefix}</div> : null}
          <input
            ref={ref}
            id={inputId}
            placeholder={placeholder ?? " "}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              "peer h-14 w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white outline-none backdrop-blur-xl transition duration-200 placeholder:text-transparent focus:border-violet-400/70 focus:bg-white/[0.065] focus:shadow-[0_0_0_1px_rgba(124,92,255,0.25)] disabled:cursor-not-allowed disabled:opacity-60 sm:h-14",
              prefix ? "pl-16" : "pl-4",
              suffix ? "pr-12" : "pr-4",
              error && "border-rose-400/70 focus:border-rose-400/70 focus:shadow-[0_0_0_1px_rgba(251,113,133,0.22)]",
              className,
            )}
            {...props}
          />
          {suffix ? <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div> : null}
        </div>
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/40 transition-all duration-200 peer-focus:top-3 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.28em] peer-focus:text-violet-200",
            hasValue && "opacity-0",
            error && "text-rose-200 peer-focus:text-rose-100",
          )}
        >
          {label}
        </label>
      </div>
      <div className="min-h-5">
        {error ? (
          <motion.p
            id={`${inputId}-error`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-xs text-rose-200"
          >
            {error}
          </motion.p>
        ) : null}
      </div>
    </div>
  );
});
