import { useEffect, useState } from "react";
import type { AuthUser } from "@/types/auth";

const STORAGE_KEY = "atlas-auth-session";

export function useAuthSession() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed && typeof parsed.id === "string" && typeof parsed.email === "string") {
          setUser(parsed);
        }
      }
    } catch {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  const persistUser = (nextUser: AuthUser | null) => {
    setUser(nextUser);

    try {
      if (nextUser) {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      } else {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Session storage can be unavailable in hardened browser modes.
    }
  };

  return {
    user,
    ready,
    setUser: persistUser,
    clearUser: () => persistUser(null),
  };
}
