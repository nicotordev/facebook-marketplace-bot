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
export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export default function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null | undefined>(undefined);
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
            fetchSession();
        });
    }, []);

    // Still loading
    if (session === undefined) {
        return <LoadingScreen />;
    }

    // Not logged in and not on login page → redirect to login
    if (session === null && location.pathname !== "/login") {
        return <Navigate to="/login" replace />;
    }

    // Logged in and on login page → redirect to home
    if (session !== null && location.pathname === "/login") {
        return <Navigate to="/" replace />;
    }

    return (
        <SessionContext.Provider value={{ session, setSession, reloadSession: fetchSession }}>
            {children}
        </SessionContext.Provider>
    );
}