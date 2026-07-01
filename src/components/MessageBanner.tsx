import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface MessageBannerProps {
  tone: "error" | "success" | "info";
  message: string;
}

const toneClasses: Record<MessageBannerProps["tone"], string> = {
  error: "border-rose-400/25 bg-rose-500/10 text-rose-100",
  success: "border-emerald-400/20 bg-emerald-500/10 text-emerald-50",
  info: "border-white/10 bg-white/5 text-white/80",
};

export function MessageBanner({ tone, message }: MessageBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn("rounded-2xl border px-4 py-3 text-sm backdrop-blur-xl", toneClasses[tone])}
      role={tone === "error" ? "alert" : "status"}
    >
      {message}
    </motion.div>
  );
}
