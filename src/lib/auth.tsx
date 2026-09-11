"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { api, tokenStore } from "./api";
import type { User } from "./types";

interface AuthContextValue {
  user: User | null;
  /** True until the first read of localStorage completes — prevents a flash of "signed out". */
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<User>;
  signUp: (input: {
    full_name: string;
    phone: string;
    email?: string;
    password: string;
  }) => Promise<User>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const stored = tokenStore.user;
    if (stored) setUserState(stored);
    setLoading(false);

    // Keep tabs in sync — signing out in one signs out the rest.
    const sync = () => setUserState(tokenStore.user);
    window.addEventListener("ejs:auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ejs:auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const signIn = React.useCallback(async (identifier: string, password: string) => {
    const result = await api.login({ identifier, password });
    tokenStore.save(result.tokens, result.user);
    setUserState(result.user);
    return result.user;
  }, []);

  const signUp = React.useCallback(
    async (input: { full_name: string; phone: string; email?: string; password: string }) => {
      const result = await api.register(input);
      tokenStore.save(result.tokens, result.user);
      setUserState(result.user);
      return result.user;
    },
    [],
  );

  const signOut = React.useCallback(() => {
    tokenStore.clear();
    setUserState(null);
  }, []);

  const refreshUser = React.useCallback(async () => {
    if (!tokenStore.access) return;
    try {
      const fresh = await api.me();
      tokenStore.saveUser(fresh);
      setUserState(fresh);
    } catch {
      // An expired session is not an error worth surfacing — just sign out quietly.
      tokenStore.clear();
      setUserState(null);
    }
  }, []);

  const setUser = React.useCallback((next: User) => {
    tokenStore.saveUser(next);
    setUserState(next);
  }, []);

  const value = React.useMemo(
    () => ({ user, loading, signIn, signUp, signOut, refreshUser, setUser }),
    [user, loading, signIn, signUp, signOut, refreshUser, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/** Redirects to login when the session is missing, once loading has settled. */
export function useRequireAuth(redirectTo = "/auth/login") {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      const next = typeof window !== "undefined" ? window.location.pathname : "/";
      router.replace(`${redirectTo}?next=${encodeURIComponent(next)}`);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}
