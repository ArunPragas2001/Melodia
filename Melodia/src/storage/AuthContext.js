import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loadSession,
  loginAccount,
  logoutAccount,
  registerAccount,
} from "./authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    loadSession()
      .then((account) => {
        if (active) setUser(account);
      })
      .catch(() => {
        if (active) setError("Could not read the saved session");
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  async function register(details) {
    return runAuth(() => registerAccount(details));
  }

  async function login(email, password) {
    return runAuth(() => loginAccount(email, password));
  }

  async function runAuth(action) {
    setBusy(true);
    setError("");

    try {
      const account = await action();
      setUser(account);
      return true;
    } catch (authError) {
      setError(authError.message || "Authentication failed");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    setError("");

    try {
      await logoutAccount();
      setUser(null);
      return true;
    } catch {
      setError("Could not sign out. Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, ready, busy, error, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
