"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HOGWARTS_HOUSES } from '@/lib/constants';
import type { UserQuizResult, HouseName } from '@/lib/types';
import { ListCollapse, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// モックデータ
const MOCK_HISTORY: UserQuizResult[] = [
  { id: '1', userId: 'mockUser', houseName: 'Gryffindor', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), scores: { Gryffindor: 10, Slytherin: 5 } },
  { id: '2', userId: 'mockUser', houseName: 'Ravenclaw', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), scores: { Ravenclaw: 12, Hufflepuff: 6 } },
  { id: '3', userId: 'mockUser', houseName: 'Gryffindor', date: new Date().toISOString(), scores: { Gryffindor: 9, Ravenclaw: 8 } },
];

const HistoryItem: React.FC<{ result: UserQuizResult }> = ({ result }) => {
  const house = HOGWARTS_HOUSES[result.houseName];
  if (!house) return null;

  return (
    <Card className="enchanted-parchment-dark flex items-center p-4 space-x-4 hover:shadow-primary/20 transition-shadow duration-300">
      <Image
        src={house.crest}
        alt={`${house.name} 紋章`}
        width={64}
        height={64}
        data-ai-hint={house.dataAiHint}
        className="rounded-full border-2 border-[hsl(var(--border))]"
      />
      <div className="flex-grow">
        <h3 className="text-lg font-semibold font-headline text-primary">{house.name}</h3>
        <p className="text-sm text-muted-foreground">組分け日: {new Date(result.date).toLocaleDateString()}</p>
      </div>
      <Link href={`/quiz/result/${house.name.toLowerCase()}`} passHref>
        <Button variant="outline" size="sm" className="text-xs">詳細を見る</Button>
      </Link>
    </Card>
  );
};

export default function HistoryPage() {
  const [history, setHistory] = useState<UserQuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // データ取得のシミュレーション
    const timer = setTimeout(() => {
      setHistory(MOCK_HISTORY.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer); // クリーンアップ
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-in-up">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-3">
          組分け帽子の記録
        </h1>
        <p className="text-lg text-foreground/80 max-w-xl mx-auto">
          過去の組分け帽子との出会いを振り返り、ホグワーツでの冒険の軌跡をたどりましょう。
        </p>
      </header>

      {isLoading ? (
        <div className="text-center text-primary">
          魔法の記録を読み込み中...
          <ListCollapse className="inline-block animate-spin h-5 w-5 ml-2" />
        </div>
      ) : history.length > 0 ? (
        <div className="space-y-6 max-w-2xl mx-auto">
          {history.map((result) => (
            <HistoryItem key={result.id} result={result} />
          ))}
        </div>
      ) : (
        <Card className="enchanted-parchment-dark text-center py-10 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">巻物は空っぽです！</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg text-foreground/80 mb-6">
              まだ組分けされていません。クイズを受けて、あなたのホグワーツ物語を始めましょう！
            </CardDescription>
            <Button asChild className="button-burgundy">
              <Link href="/quiz">
                <RotateCcw className="mr-2 h-4 w-4" />
                組分けクイズを受ける
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
