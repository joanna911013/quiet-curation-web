"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { logout } from "./actions";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    if (isLoading) {
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const result = await logout();
      if (!result.ok) {
        setError(result.error ?? "Unable to log out.");
        setIsLoading(false);
        return;
      }
      router.replace("/login");
      router.refresh();
    } catch (caughtError) {
      console.error("Logout failed.", caughtError);
      setError("Unable to log out.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="ghost" onClick={handleLogout} disabled={isLoading}>
        {isLoading ? "Logging out..." : "Logout"}
      </Button>
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}
