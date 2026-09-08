"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HOGWARTS_HOUSES, HOUSE_NAMES_ARRAY } from '@/lib/constants';
import type { HouseName } from '@/lib/types';
import { BarChart3, Award, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getAggregatedHouseCounts } from '@/lib/storage';

interface HouseStat {
  name: HouseName;
  count: number;
}

const LeaderboardBar: React.FC<{ houseStat: HouseStat; maxCount: number; rank: number }> = ({
  houseStat,
  maxCount,
  rank,
}) => {
  const house = HOGWARTS_HOUSES[houseStat.name];
  if (!house) return null;
  const percentage = maxCount > 0 ? (houseStat.count / maxCount) * 100 : 0;

  return (
    <div
      className={cn(
        "p-4 rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-lg hover:border-primary/50",
        `theme-${house.name.toLowerCase()}`
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 text-center font-bold text-lg text-primary font-headline">
            #{rank}
          </div>
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={house.crest}
              alt={`${house.name} 紋章`}
              width={48}
              height={48}
              data-ai-hint={house.dataAiHint}
              className="rounded-full border-2 border-[hsl(var(--house-secondary))] object-cover w-12 h-12"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold font-headline text-[hsl(var(--house-primary))]">
              {house.name}
            </h3>
            <p className="text-xs text-muted-foreground">{house.values.join(' ・ ')}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold font-headline text-foreground">
            {houseStat.count.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">名</span>
          </p>
        </div>
      </div>
      <Progress
        value={percentage}
        className="h-2.5 bg-muted/40 [&>div]:bg-[hsl(var(--house-primary))]"
      />
    </div>
  );
};

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<HouseStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const counts = getAggregatedHouseCounts();
    const stats: HouseStat[] = HOUSE_NAMES_ARRAY.map((name) => ({
      name,
      count: counts[name] || 0,
    })).sort((a, b) => b.count - a.count);

    setLeaderboardData(stats);
    setIsLoading(false);
  }, []);

  const maxCount = Math.max(...leaderboardData.map((stat) => stat.count), 0);

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-in-up">
      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-medium mb-3">
          <Sparkles className="h-3.5 w-3.5" /> ホグワーツ寮別勢力図
        </div>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-3">
          世界の寮リーダーボード
        </h1>
        <p className="text-lg text-foreground/80 max-w-xl mx-auto">
          現在、どの寮が新入生の数でリードしているか確認できます。寮杯（ハウス・カップ）の栄冠を勝ち取るのはどの寮でしょうか？
        </p>
      </header>

      {isLoading ? (
        <div className="text-center text-primary py-12">
          リーダーボードの精霊を召喚中... <BarChart3 className="inline-block animate-spin h-5 w-5 ml-2" />
        </div>
      ) : leaderboardData.length > 0 ? (
        <div className="space-y-4 max-w-3xl mx-auto">
          {leaderboardData.map((stat, index) => (
            <div key={stat.name} className="relative">
              <LeaderboardBar houseStat={stat} maxCount={maxCount} rank={index + 1} />
              {index === 0 && (
                <Award
                  className="absolute -top-3 -right-3 h-8 w-8 text-yellow-400 transform rotate-12 fill-current"
                  style={{ filter: "drop-shadow(0 0 5px gold)" }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <Card className="enchanted-parchment-dark text-center py-10 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">リーダーボードは空です</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg text-foreground/80">
              まだ生徒は組分けされていません。あなたが最初になりましょう！
            </CardDescription>
          </CardContent>
        </Card>
      )}

      <p className="text-center text-xs text-muted-foreground mt-8">
        診断を受けるごとに、各寮の生徒数カウントにあなたの結果が反映されます。
      </p>
    </div>
  );
}
