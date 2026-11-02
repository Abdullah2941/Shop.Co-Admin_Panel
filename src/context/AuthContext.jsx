import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "../api/client";

const USER_KEY = "shopco-admin-user";
const AuthContext = createContext(null);

function readUser() {
  try {
    return getToken() ? JSON.parse(localStorage.getItem(USER_KEY)) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [booting, setBooting] = useState(Boolean(getToken()));

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  // verify the saved token when the panel opens
  useEffect(() => {
    if (!getToken()) return;
    api("/auth/me")
      .then((d) => {
        if (d.user.role !== "admin") return logout();
        setUser(d.user);
        localStorage.setItem(USER_KEY, JSON.stringify(d.user));
      })
      .catch((err) => {
        if (err.status === 401 || err.status === 403) logout();
      })
      .finally(() => setBooting(false));
  }, [logout]);

  useEffect(() => {
    window.addEventListener("admin:unauthorized", logout);
    return () => window.removeEventListener("admin:unauthorized", logout);
  }, [logout]);

  // throws on wrong credentials so the Login page can show the message
  const login = async (email, password) => {
    const d = await api("/auth/admin-login", { method: "POST", auth: false, body: { email: email.trim(), password } });
    setToken(d.token);
    localStorage.setItem(USER_KEY, JSON.stringify(d.user));
    setUser(d.user);
  };

  return <AuthContext.Provider value={{ user, isAuthed: Boolean(user), booting, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
