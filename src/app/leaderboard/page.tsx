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
        "p-3 sm:p-4 rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-lg hover:border-primary/50",
        `theme-${house.name.toLowerCase()}`
      )}
    >
      <div className="flex items-center justify-between mb-2.5 gap-2">
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <div className="w-6 sm:w-8 text-center font-bold text-base sm:text-lg text-primary font-headline shrink-0">
            #{rank}
          </div>
          <Image
            src={house.crest}
            alt={`${house.name} 紋章`}
            width={44}
            height={44}
            data-ai-hint={house.dataAiHint}
            className="rounded-full border border-primary/40 shrink-0 w-9 h-9 sm:w-11 sm:h-11 object-contain"
          />
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold font-headline text-[hsl(var(--house-primary))] truncate">
              {house.name}
            </h3>
            <p className="text-[11px] text-muted-foreground truncate">{house.values.slice(0, 2).join(' ・ ')}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-base sm:text-lg font-bold font-headline text-foreground">
            {houseStat.count.toLocaleString()} <span className="text-[11px] font-normal text-muted-foreground">名</span>
          </p>
        </div>
      </div>
      <Progress
        value={percentage}
        className="h-2 sm:h-2.5 bg-muted/40 [&>div]:bg-[hsl(var(--house-primary))]"
      />
    </div>
  );
};

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<HouseStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = () => {
    const counts = getAggregatedHouseCounts();
    const stats: HouseStat[] = HOUSE_NAMES_ARRAY.map((name) => ({
      name,
      count: counts[name] || 0,
    })).sort((a, b) => b.count - a.count);

    setLeaderboardData(stats);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('hogwarts_house_counts_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('hogwarts_house_counts_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const totalCount = leaderboardData.reduce((sum, stat) => sum + stat.count, 0);
  const maxCount = Math.max(...leaderboardData.map((stat) => stat.count), 0);

  return (
    <div className="py-4 sm:py-8 px-2 sm:px-4 max-w-xl sm:max-w-3xl mx-auto animate-fade-in-up">
      <header className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-medium mb-2.5">
          <Sparkles className="h-3.5 w-3.5 text-yellow-400" /> 世界の寮リーダーボード
        </div>
        <h1 className="text-2xl sm:text-4xl font-headline font-bold text-primary mb-2">
          世界の寮別リーダーボード
        </h1>
        <p className="text-xs sm:text-sm text-foreground/80 max-w-md mx-auto">
          組分け帽子による実際の受検回数をリアルタイムに集計しています
        </p>
        <div className="mt-3 inline-block px-3 py-1 rounded-lg bg-background/60 border border-primary/25 text-xs text-primary font-semibold">
          実受検総数: <span className="text-yellow-400 font-bold">{totalCount.toLocaleString()}</span> 名
        </div>
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
              {index === 0 && totalCount > 0 && (
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
        診断を受けるごとに、各寮の生徒数カウントにあなたの結果が即座に反映されます。
      </p>
    </div>
  );
}
