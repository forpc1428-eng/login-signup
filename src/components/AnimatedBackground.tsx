import { motion, useReducedMotion } from "framer-motion";

export function AnimatedBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.18),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,#101014_0%,#0E0E11_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <motion.div
        className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 30, -10, 0], y: [0, -18, 20, 0], scale: [1, 1.08, 0.98, 1] }}
        transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-[-8rem] top-14 h-80 w-80 rounded-full bg-white/8 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -24, 18, 0], y: [0, 20, -14, 0], scale: [1, 1.04, 1, 1.02, 1] }}
        transition={reduceMotion ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/12 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -18, 16, 0], y: [0, -8, 12, 0], scale: [1, 1.06, 1] }}
        transition={reduceMotion ? undefined : { duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
