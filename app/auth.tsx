import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { loginRequest } from "./api";

type AuthUser = { username: string; token?: string } | null;

type AuthContextValue = {
    user: AuthUser;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = typeof window !== "undefined" ? localStorage.getItem("cvd_auth_user") : null;
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch { }
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        if (!username || !password) throw new Error("Invalid credentials");
        const token = await loginRequest(username, password);
        const nextUser = { username, token } as const;
        setUser(nextUser);
        localStorage.setItem("cvd_auth_user", JSON.stringify(nextUser));
        localStorage.setItem("cvd_token", token);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("cvd_auth_user");
        localStorage.removeItem("cvd_token");
    }, []);

    const value = useMemo<AuthContextValue>(() => ({ user, login, logout, isLoading }), [user, login, logout, isLoading]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isLoading && !user && location.pathname !== "/login") {
            navigate("/login", { replace: true });
        }
    }, [isLoading, user, location.pathname, navigate]);

    if (isLoading) return null;
    if (!user && location.pathname !== "/login") return null;
    return <>{children}</>;
}
