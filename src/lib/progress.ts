"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "tizada:progress:v1";
const listeners = new Set<() => void>();

function read(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    // Storage blocked or corrupted: behave as if nothing was completed.
    return {};
  }
}

function write(next: Record<string, boolean>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / privacy-mode errors; progress is a convenience only.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep tabs in sync.
  const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// Snapshot must be referentially stable between changes for useSyncExternalStore.
let cachedRaw: string | null = null;
let cachedValue: Record<string, boolean> = {};
function getSnapshot(): Record<string, boolean> {
  const raw = typeof window === "undefined" ? null : localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = read();
  }
  return cachedValue;
}
const EMPTY: Record<string, boolean> = {};

export function useProgress() {
  const done = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const toggle = useCallback((key: string) => {
    const current = read();
    write({ ...current, [key]: !current[key] });
  }, []);
  return { done, toggle };
}
