import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { emptyLibrary, loadLibrary, saveLibrary } from "./libraryStorage";

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const { user } = useAuth();
  const [stored, setStored] = useState({ userId: null, data: emptyLibrary() });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const current = useRef(emptyLibrary());
  const userId = user?.id || null;
  const ready = stored.userId === userId;
  const library = ready ? stored.data : emptyLibrary();

  useEffect(() => {
    let active = true;

    loadLibrary(userId)
      .then((data) => {
        if (!active) return;
        current.current = data;
        setStored({ userId, data });
        setError("");
      })
      .catch(() => {
        if (!active) return;
        current.current = emptyLibrary();
        setStored({ userId, data: emptyLibrary() });
        setError("Could not read your saved library");
      });

    return () => {
      active = false;
    };
  }, [userId]);

  async function updateLibrary(change) {
    if (!userId || saving) return false;
    setSaving(true);
    setError("");

    try {
      const next = change(current.current);
      const saved = await saveLibrary(userId, next);
      current.current = saved;
      setStored({ userId, data: saved });
      return true;
    } catch {
      setError("Could not save your changes");
      return false;
    } finally {
      setSaving(false);
    }
  }

  function toggleFavourite(id) {
    return updateLibrary((old) => ({
      ...old,
      favourites: old.favourites.includes(id)
        ? old.favourites.filter((item) => item !== id)
        : [...old.favourites, id],
    }));
  }

  function addScore(score, total) {
    return updateLibrary((old) => ({
      ...old,
      scores: [
        { score, total, date: new Date().toISOString() },
        ...old.scores,
      ].slice(0, 50),
    }));
  }

  return (
    <LibraryContext.Provider
      value={{ ...library, ready, saving, error, toggleFavourite, addScore }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const value = useContext(LibraryContext);
  if (!value) throw new Error("useLibrary must be used inside LibraryProvider");
  return value;
}
