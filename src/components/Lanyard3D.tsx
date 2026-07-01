import { useEffect, useState } from "react";
import type { AuthUser } from "@/types/auth";
import LanyardJSX from "./Lanyard";

interface Lanyard3DProps {
  user: AuthUser;
  onLogout?: () => void;
}

export function Lanyard3D({ user, onLogout }: Lanyard3DProps) {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const generateImages = async () => {
      try {
        const { generateCardImage } = await import("@/utils/generateCardImage");
        
        const [front, back] = await Promise.all([
          generateCardImage(user, "front"),
          generateCardImage(user, "back"),
        ]);

        if (mounted) {
          setFrontImage(front);
          setBackImage(back);
          setLoading(false);
        }
      } catch (error) {
        console.error("Card image generation failed:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void generateImages();

    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0E0E11]">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 backdrop-blur-xl">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-violet-400" />
          <p className="text-sm text-white/72">Generating your badge</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {onLogout ? (
        <button
          type="button"
          onClick={onLogout}
          className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-white/80 backdrop-blur-md transition hover:border-violet-400/40 hover:bg-black/45 hover:text-white"
        >
          Sign out
        </button>
      ) : null}
      <LanyardJSX
        position={[0, -0.2, 19]}
        gravity={[0, -35, 0]}
        fov={20}
        transparent={true}
        frontImage={frontImage}
        backImage={backImage}
        imageFit="cover"
        lanyardWidth={1.1}
      />
    </div>
  );
}
