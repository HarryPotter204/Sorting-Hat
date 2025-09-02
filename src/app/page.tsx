import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-5xl font-bold mb-8">ホグワーツ 組分け診断!!</h1>
      <p className="text-xl mb-6">
        組分け帽子の質問に答えて、あなたの寮を見つけよう
      </p>
      <Button asChild size="lg">
        <Link href="/quiz">組分けの儀式を始める</Link>
      </Button>
    </div>
  );
}
