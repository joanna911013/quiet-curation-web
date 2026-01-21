"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/button";

type RetryButtonProps = {
  className?: string;
};

export function RetryButton({ className }: RetryButtonProps) {
  const router = useRouter();

  return (
    <Button variant="ghost" onClick={() => router.refresh()} className={className}>
      Retry
    </Button>
  );
}
