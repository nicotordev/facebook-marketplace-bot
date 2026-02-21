import React, { useEffect, useState, createContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import sessionService, { type Session } from "../services/session.service";
import { LoadingScreen } from "../components/loading-screen";

type SessionContextType = {
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null | undefined>>;
  reloadSession: () => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const SessionContext = createContext<SessionContextType | undefined>(
  undefined,
);

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchSession = async () => {
    try {
      const sessionData = await sessionService.getSession();
      setSession(sessionData);
    } catch (error: unknown) {
      console.error(error);
      setSession(null);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      fetchSession().finally(() => {
        setLoading(false);
      });
    });
  }, []);

  // Still loading
  if (loading) {
    return <LoadingScreen />;
  }

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  // Not logged in and not on auth page → redirect to login
  if (!session && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  // Logged in and on auth page → redirect to home
  if (session && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <SessionContext.Provider
      value={{ session, setSession, reloadSession: fetchSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}
