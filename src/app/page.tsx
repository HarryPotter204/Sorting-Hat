import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HOGWARTS_HOUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { History, Trophy, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnnouncementBanner } from "@/components/shared/AnnouncementBanner";
import { SortingHatIcon } from "@/components/icons/HouseIcons";

export default function HomePage() {
  const houses = Object.values(HOGWARTS_HOUSES);

  return (
    <div className="flex flex-col items-center text-center space-y-6 sm:space-y-10 py-1 sm:py-6 max-w-lg sm:max-w-3xl mx-auto animate-fade-in-up">
      {/* Hogwarts Notice Board Popup Trigger Banner (In-flow, never covers buttons or text) */}
      <AnnouncementBanner />

      {/* Hero Section centered around the user's Sorting Hat image */}
      <header className="w-full space-y-4 px-2">
        <div className="relative mx-auto w-40 h-40 sm:w-52 sm:h-52 my-1 flex items-center justify-center">
          <Image
            src="/images/hat.png"
            alt="ホグワーツ組分け帽子"
            width={220}
            height={220}
            priority
            className="w-full h-full object-contain rounded-2xl drop-shadow-xl select-none relative z-10"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-headline font-bold tracking-tight text-primary leading-tight">
            ホグワーツ 組分け帽子
          </h1>
          {/* Hat Dialogue Speech Bubble */}
          <div className="p-3.5 px-4 rounded-2xl bg-card/80 border border-primary/30 backdrop-blur-sm max-w-md mx-auto shadow-md">
            <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed italic">
              「さあ、頭にかぶってみるがよい…お前の勇気、知性、誠実さ、あるいは野心…すべて見通してくれよう！」
            </p>
          </div>
        </div>

        {/* Primary Action Buttons - Mobile-First Touch Targets */}
        <div className="w-full space-y-2.5 pt-1 max-w-md mx-auto">
          <Button 
            asChild 
            size="lg" 
            className="w-full button-burgundy py-6 text-base sm:text-lg font-bold rounded-xl shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Link href="/quiz">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              組分け帽子をかぶる（診断開始）
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-2.5">
            <Button 
              asChild 
              variant="outline" 
              className="w-full border-primary/40 text-primary hover:bg-primary/10 py-5 rounded-xl text-xs sm:text-sm font-semibold h-auto"
            >
              <Link href="/history" className="flex items-center justify-center gap-1.5">
                <History className="h-4 w-4 shrink-0" />
                組分けの記録
              </Link>
            </Button>

            <Button 
              asChild 
              variant="outline" 
              className="w-full border-primary/40 text-primary hover:bg-primary/10 py-5 rounded-xl text-xs sm:text-sm font-semibold h-auto"
            >
              <Link href="/leaderboard" className="flex items-center justify-center gap-1.5">
                <Trophy className="h-4 w-4 shrink-0" />
                寮別統計
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Four Houses Section - 2x2 Grid on Mobile with nowrap title */}
      <section className="w-full space-y-3 px-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl sm:text-2xl font-headline font-bold text-primary">
            ホグワーツ四つの寮
          </h2>
          <span className="text-[11px] text-muted-foreground">Four Great Houses</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
          {houses.map((house) => (
            <Card
              key={house.name}
              className={cn(
                "enchanted-parchment-dark overflow-hidden rounded-xl border border-primary/30 transition-all duration-200 active:scale-[0.98]", 
                `theme-${house.name.toLowerCase()}`
              )}
            >
              <CardHeader className="items-center p-2.5 sm:p-4 pb-1.5 sm:pb-2 bg-[hsl(var(--house-primary,_var(--card)))] text-[hsl(var(--house-secondary,_var(--card-foreground)))]">
                <div className="relative w-14 h-14 sm:w-20 sm:h-20 mb-1 flex items-center justify-center">
                  <Image
                    src={house.crest}
                    alt={`${house.name} Crest`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain rounded-full drop-shadow"
                  />
                </div>
                <CardTitle className="font-headline text-[13px] sm:text-base md:text-lg font-bold whitespace-nowrap tracking-tight leading-none px-1">
                  {house.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2.5 sm:p-3 text-left">
                <p className="text-[11px] sm:text-xs text-foreground/80 leading-snug line-clamp-2">
                  <span className="text-primary font-semibold">特長:</span> {house.values.slice(0, 2).join(", ")}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground truncate">
                  創設者: {house.founder}
                </p>
              </CardContent>
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

