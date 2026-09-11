import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HOGWARTS_HOUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { History, Trophy, Sparkles, Gamepad2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnnouncementBanner } from "@/components/shared/AnnouncementBanner";
import { SortingHatIcon } from "@/components/icons/HouseIcons";

export default function HomePage() {
  const houses = Object.entries(HOGWARTS_HOUSES);

  return (
    <div className="flex flex-col items-center text-center space-y-6 sm:space-y-10 py-1 sm:py-6 max-w-lg sm:max-w-3xl mx-auto animate-fade-in-up">
      {/* Hogwarts Notice Board Popup Trigger Banner (In-flow, never covers buttons or text) */}
      <AnnouncementBanner />

      {/* Hero - The entrance to the magical world */}
      <header className="w-full space-y-5 px-2 animate-fade-in-up">
        <div className="relative mx-auto w-40 h-40 sm:w-52 sm:h-52 my-1 flex items-center justify-center">
          {/* Soft candlelight halo behind the hat */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,hsl(43_60%_60%/0.16),transparent_65%)] blur-md" aria-hidden="true" />
          <Image
            src="/images/hat.jpg"
            alt="ホグワーツ組分け帽子"
            width={220}
            height={220}
            priority
            className="w-full h-full object-contain rounded-2xl drop-shadow-xl select-none relative z-10"
          />
        </div>

        <div className="space-y-3">
          <p className="font-display text-xs sm:text-sm tracking-[0.35em] text-primary/80 uppercase">
            The Sorting Hat
          </p>
          <div className="ornament-rule" aria-hidden="true">
            <span className="text-[10px]">✦</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-headline font-bold tracking-tight text-primary leading-tight">
            ホグワーツ 組分け帽子
          </h1>
          <p className="text-sm sm:text-base text-foreground/85 font-medium">
            あなたの寮を決める、魔法の診断
          </p>
          {/* Hat Dialogue Speech Bubble - old parchment page */}
          <div className="parchment p-3.5 px-4 rounded-lg max-w-md mx-auto relative">
            <p className="text-xs sm:text-sm text-[#43371f] font-medium leading-relaxed italic mt-1">
              「さあ、頭にかぶってみるがよい…お前の勇気、知性、誠実さ、あるいは野心…すべて見通してくれよう！」
            </p>
          </div>
          <p className="text-base sm:text-lg font-headline font-semibold text-foreground/90 pt-1">
            ―― あなたはどの寮に導かれるのか？ ――
          </p>
        </div>

        {/* Primary Action Buttons - Mobile-First Touch Targets */}
        <div className="w-full space-y-2.5 pt-1 max-w-md mx-auto">
          <Button
            asChild
            size="lg"
            className="w-full button-gold py-6 text-base sm:text-lg rounded-xl shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Link href="/quiz">
              <Sparkles className="w-5 h-5" />
              診断を始める
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-2.5">
            <Button
              asChild
              variant="outline"
              className="w-full border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/70 py-5 rounded-xl text-xs sm:text-sm font-semibold h-auto"
            >
              <Link
                href="/history"
                className="flex items-center justify-center gap-1.5"
              >
                <History className="h-4 w-4 shrink-0" />
                組分けの記録
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/70 py-5 rounded-xl text-xs sm:text-sm font-semibold h-auto"
            >
              <Link
                href="/leaderboard"
                className="flex items-center justify-center gap-1.5"
              >
                <Trophy className="h-4 w-4 shrink-0" />
                寮別統計
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Mini Game - Invitation to play in the magical world (external site) */}
      <section className="w-full px-2">
        <a
          href="https://harrypotter307-game.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="魔法のミニゲーム（外部サイト・新しいタブで開きます）"
          className="group block rounded-xl border border-primary/30 bg-[hsl(var(--card)/0.85)] backdrop-blur-[4px] p-4 sm:p-5 text-left shadow-[0_8px_24px_hsl(230_45%_3%/0.55),inset_0_1px_0_hsl(45_60%_80%/0.06)] transition-all duration-300 hover:border-primary/60 hover:-translate-y-0.5 hover:shadow-[0_0_28px_hsl(43_60%_60%/0.18),0_8px_24px_hsl(230_45%_3%/0.55)]"
        >
          <div className="flex items-start gap-3.5">
            {/* Gilded game emblem with soft glow on hover */}
            <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full border border-primary/40 bg-primary/10 text-primary transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_12px_hsl(var(--primary)/0.45)]">
              <Gamepad2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="font-headline text-base sm:text-lg font-bold text-primary tracking-wide">
                  魔法のミニゲーム
                </h2>
                <ExternalLink
                  className="h-3.5 w-3.5 shrink-0 text-primary/50"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-1 text-xs sm:text-sm text-foreground/80 leading-relaxed">
                ちょっと息抜きに、魔法の世界で遊んでみよう。
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary/90 transition-colors group-hover:text-primary">
                ゲームを遊ぶ
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </p>
            </div>
          </div>
        </a>
      </section>

      {/* Four Houses Section - 2x2 Grid on Mobile with nowrap title */}
      <section className="w-full space-y-3 px-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl sm:text-2xl font-headline font-bold text-primary">
            ホグワーツ四つの寮
          </h2>
          <span className="text-[11px] text-muted-foreground">
            Four Great Houses
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
          {houses.map(([houseKey, house]) => (
            <Card
              key={house.name}
              className={cn(
                "enchanted-parchment-dark overflow-hidden rounded-xl border border-primary/30 transition-all duration-200 active:scale-[0.98]",
                `theme-${house.name.toLowerCase()}`,
              )}
            >
              <Link
                href={`/houses/${houseKey.toLowerCase()}`}
                className="block transition-transform duration-200 motion-safe:hover:scale-[1.03]"
                aria-label={`${house.name}の詳細を見る`}
              >
                <CardHeader className="items-center p-2.5 sm:p-4 pb-1.5 sm:pb-2 bg-[hsl(var(--house-primary,_var(--card)))] text-[hsl(var(--house-secondary,_var(--card-foreground)))]">
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 mb-1 flex items-center justify-center overflow-hidden rounded-full">
                    <Image
                      src={house.crest}
                      alt={`${house.name} Crest`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded-full drop-shadow"
                    />
                  </div>
                  <CardTitle className="font-headline text-[13px] sm:text-base md:text-lg font-bold whitespace-nowrap tracking-tight leading-none px-1">
                    {house.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2.5 sm:p-3 text-left">
                  <p className="text-[11px] sm:text-xs text-foreground/80 leading-snug line-clamp-2">
                    <span className="text-primary font-semibold">特長:</span>{" "}
                    {house.values.slice(0, 2).join(", ")}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground truncate">
                    創設者: {house.founder}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section - Compact for Mobile */}
      <section className="w-full px-2">
        <Card className="enchanted-parchment-dark rounded-xl border border-primary/30 text-left p-4 sm:p-5">
          <CardHeader className="p-0 pb-2.5">
            <CardTitle className="font-headline text-lg sm:text-xl text-primary flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              組分けの儀式とは
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-2 text-xs sm:text-sm text-foreground/85 leading-relaxed">
            <p>
              組分け帽子は千年以上にわたり、ホグワーツの新入生一人ひとりの適性と心を読み解き、最適な寮を選び出してきました。
            </p>
            <p>
              直感で質問に答えることで、あなたの内に眠る騎士道精神、知性、友愛、あるいは大志が導き出されます。
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
