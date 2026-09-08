import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HOGWARTS_HOUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { History, Trophy, Sparkles } from "lucide-react";
import { SortingHatIcon } from "@/components/icons/HouseIcons";
import Image from "next/image";
import Link from "next/link";
import { AnnouncementBanner } from "@/components/shared/AnnouncementBanner";

export default function HomePage() {
  const houses = Object.values(HOGWARTS_HOUSES);

  return (
    <div className="flex flex-col items-center text-center space-y-12 py-8 animate-fade-in-up">
      <AnnouncementBanner />

      {/* Hero Section centered on the Sorting Hat */}
      <header className="space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-medium shadow-sm">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span>ホグワーツ魔法魔術学校 ・ 伝統の選別の儀</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-primary leading-tight text-center">
          <span className="block md:inline">伝説の</span>
          <span className="block md:inline">組分け帽子</span>
        </h1>

        <p className="text-xl md:text-2xl text-foreground/85 max-w-2xl mx-auto leading-relaxed">
          千年の歴史を持つ組分け帽子をかぶり、あなたの心、勇気、知恵、野心にふさわしいホグワーツの寮を判定してもらおう。
        </p>

        {/* Featured Sorting Hat Interactive Card */}
        <div className="p-6 md:p-8 rounded-2xl enchanted-parchment-dark border border-primary/40 shadow-2xl relative overflow-hidden text-center max-w-xl mx-auto group">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative p-5 rounded-full bg-primary/15 border-2 border-primary/50 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <SortingHatIcon className="w-16 h-16 md:w-20 md:h-20 text-yellow-400 drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]" />
              <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-yellow-400 pointer-events-none" />
            </div>

            <div className="space-y-2">
              <p className="font-headline italic text-lg md:text-xl text-primary/95">
                「ふむ…頭の中を覗かせてもらおうかの…答えはすべて、そなたの心の中にある」
              </p>
              <p className="text-xs md:text-sm text-foreground/75">
                質問に答えていくと、組分け帽子があなたの本質を見極め、最もふさわしい寮へと導きます。
              </p>
            </div>

            <Button asChild size="lg" className="button-gold text-lg px-8 py-6 shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
              <Link href="/quiz" className="flex items-center justify-center gap-3">
                <SortingHatIcon className="h-6 w-6 text-yellow-200" />
                <span>組分け帽子をかぶる（診断を始める）</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
          <Button asChild size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 py-5">
            <Link href="/history">
              <History className="mr-2 h-5 w-5" />
              組分けの記録
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 py-5">
            <Link href="/leaderboard">
              <Trophy className="mr-2 h-5 w-5" />
              寮リーダーボード
            </Link>
          </Button>
        </div>
      </header>

      {/* Four Houses Section with Equalized Image Dimensions */}
      <section className="w-full max-w-5xl space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-headline text-primary/90">ホグワーツ四寮</h2>
          <p className="text-sm text-muted-foreground">創設者たちの魂と誇りが息づく四つの誇り高き寮</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {houses.map((house) => (
            <Card
              key={house.name}
              className={cn("enchanted-parchment-dark overflow-hidden group transition-all duration-300 hover:shadow-xl hover:border-primary/60", `theme-${house.name.toLowerCase()}`)}
            >
              <CardHeader className="items-center p-4 bg-[hsl(var(--house-primary,_var(--card)))] text-[hsl(var(--house-secondary,_var(--card-foreground)))]">
                <div className="relative w-24 h-24 mb-2 flex items-center justify-center flex-shrink-0">
                  <Image
                    src={house.crest}
                    alt={`${house.name} Crest`}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover rounded-full border-2 border-[hsl(var(--house-secondary))] shadow-md group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="font-headline text-2xl">{house.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-sm">
                <CardDescription className="text-foreground/80">
                  <strong className="text-[hsl(var(--house-secondary))]">徳目:</strong> {house.values.join(", ")}.
                </CardDescription>
                <p className="mt-2 text-xs text-muted-foreground">創設者: {house.founder}</p>
                <p className="mt-1 text-xs text-muted-foreground">象徴: {house.animal} ({house.element})</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Sorting Hat Lore & Ceremony Section */}
      <section className="w-full max-w-3xl">
        <Card className="enchanted-parchment-dark border border-primary/30 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl text-primary flex items-center justify-center gap-2">
              <SortingHatIcon className="h-6 w-6 text-primary" />
              組分け帽子の歴史と儀式
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-left text-foreground/90 leading-relaxed">
            <p>
              かつてホグワーツの創設者であるゴドリック・グリフィンドール、ヘルガ・ハッフルパフ、ロウェナ・レイブンクロー、サラザール・スリザリンの四賢人は、自分たちが世を去った後も生徒たちを正しく寮に導けるよう、グリフィンドールの帽子に自らの知恵と心を吹き込みました。
            </p>
            <p>
              帽子はあなたの潜在能力、秘めたる勇気、学問への情熱、仲間への思いやり、あるいは大志を見定め、あなた自身が最も輝ける寮へと組分けを行います。
            </p>
            <div className="pt-2 flex justify-center">
              <Button asChild className="button-burgundy text-base px-6 py-5">
                <Link href="/quiz" className="flex items-center gap-2">
                  <SortingHatIcon className="h-5 w-5" />
                  組分けの儀式を始める
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

