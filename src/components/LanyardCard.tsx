import { useEffect, useMemo, useState } from "react";
import * as QRCode from "qrcode";
import { motion, useReducedMotion } from "framer-motion";
import type { AuthUser } from "@/types/auth";

interface LanyardCardProps {
  user: AuthUser;
  onLogout: () => void;
}

export function LanyardCard({ user, onLogout }: LanyardCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrError, setQrError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const cardVariants = useMemo(
    () => ({
      initial: { opacity: 0, y: -120, scale: 0.95 },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: reduceMotion ? 0 : [-1.2, 1.2, -1.2],
      },
      exit: { opacity: 0, y: -40, scale: 0.92 },
    }),
    [reduceMotion],
  );

  useEffect(() => {
    let mounted = true;

    const createQr = async () => {
      try {
        setQrError(null);
        const next = await QRCode.toDataURL(user.email, {
          margin: 1,
          width: 232,
          errorCorrectionLevel: "M",
          color: {
            dark: "#0E0E11",
            light: "#ffffff",
          },
        });

        if (mounted) {
          setQrDataUrl(next);
        }
      } catch {
        if (mounted) {
          setQrError("QR generation failed.");
          setQrDataUrl("");
        }
      }
    };

    void createQr();

    return () => {
      mounted = false;
    };
  }, [user.email]);

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: "spring", stiffness: 85, damping: 13 }}
      className="mx-auto w-full max-w-md"
    >
      <div className="mx-auto mb-5 h-14 w-px rounded-full bg-gradient-to-b from-white/50 via-violet-300/70 to-transparent" />
      <div className="mx-auto mb-4 h-4 w-4 rounded-full border border-white/20 bg-white/10 shadow-[0_0_0_8px_rgba(255,255,255,0.02)]" />

      <motion.section
        animate={reduceMotion ? undefined : { rotate: [-1, 1, -1] }}
        transition={reduceMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/8 pb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.42em] text-violet-200/80">Verified badge</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">{user.fullName}</h3>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-white/65 transition hover:border-violet-400/40 hover:text-white"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="space-y-4 text-sm text-white/72">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/35">Email</p>
              <p className="mt-2 break-words text-base text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/35">UUID</p>
              <p className="mt-2 break-all font-mono text-xs leading-6 text-white/86">{user.id}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/35">Issued</p>
              <p className="mt-2 text-sm text-white/72">{new Date(user.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
            <div className="rounded-2xl border border-white/10 bg-white p-2">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${user.email}`}
                  className="h-[220px] w-[220px] select-none rounded-xl"
                  draggable={false}
                />
              ) : (
                <div className="flex h-[220px] w-[220px] items-center justify-center rounded-xl bg-white text-sm font-medium text-slate-900">
                  {qrError ?? "Generating QR"}
                </div>
              )}
            </div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/35">Email QR</p>
            {qrError ? <p className="text-xs text-rose-200">{qrError}</p> : null}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
