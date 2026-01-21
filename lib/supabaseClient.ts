import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

if (typeof window !== "undefined") {
  const storage = supabase.auth.storage;
  const codeVerifierSuffix = "-code-verifier";
  const originalGetItem = storage.getItem.bind(storage);
  const originalSetItem = storage.setItem.bind(storage);
  const originalRemoveItem = storage.removeItem.bind(storage);

  storage.getItem = async (key: string) => {
    try {
      const value = await originalGetItem(key);
      if (value || !key.endsWith(codeVerifierSuffix)) {
        return value;
      }
    } catch (error) {
      if (!key.endsWith(codeVerifierSuffix)) {
        throw error;
      }
    }
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  storage.setItem = async (key: string, value: string) => {
    if (key.endsWith(codeVerifierSuffix)) {
      try {
        await originalSetItem(key, value);
      } catch {
        // Cookie write failed; fall back to localStorage below.
      }
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Ignore localStorage failures (e.g., private mode).
      }
      return;
    }
    await originalSetItem(key, value);
  };

  storage.removeItem = async (key: string) => {
    if (key.endsWith(codeVerifierSuffix)) {
      try {
        await originalRemoveItem(key);
      } catch {
        // Ignore cookie removal errors for the code verifier.
      }
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore localStorage failures.
      }
      return;
    }
    await originalRemoveItem(key);
  };
}
