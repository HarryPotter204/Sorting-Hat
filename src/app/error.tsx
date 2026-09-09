"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 py-8 space-y-4">
      <div className="w-12 h-12 rounded-full bg-destructive/20 border border-destructive/40 flex items-center justify-center text-destructive">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-headline font-bold text-foreground">
        魔法の呪文に乱れが生じました
      </h2>
      <p className="text-xs text-muted-foreground max-w-sm">
        一時的な不具合が発生しました。もう一度試すか、大広間へお戻りください。
      </p>
      <Button
        onClick={() => reset()}
        variant="outline"
        size="sm"
        className="border-primary/40 text-primary"
      >
        再試行する
      </Button>
    </div>
  );
}
