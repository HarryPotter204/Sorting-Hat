import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-12 space-y-5 animate-fade-in-up">
      <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary mx-auto">
        <Compass className="w-8 h-8 text-yellow-400" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary">
          404 - 迷宮の階段
        </h1>
        <p className="text-sm text-foreground/80 max-w-md mx-auto leading-relaxed">
          階段が動いて道が変わってしまったようです。お探しの部屋や教室は見つかりませんでした。
        </p>
      </div>
      <Button asChild className="button-burgundy text-sm font-semibold rounded-xl px-6 py-5">
        <Link href="/">&larr; 大広間（ホーム）に戻る</Link>
      </Button>
    </div>
  );
}
