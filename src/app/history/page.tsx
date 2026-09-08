"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HOGWARTS_HOUSES } from '@/lib/constants';
import type { UserQuizResult } from '@/lib/types';
import { ListCollapse, RotateCcw, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getStoredQuizResults, deleteQuizResult, clearQuizResults } from '@/lib/storage';

const HistoryItem: React.FC<{ result: UserQuizResult; onDelete: (id: string) => void }> = ({ result, onDelete }) => {
  const house = HOGWARTS_HOUSES[result.houseName];
  if (!house) return null;

  return (
    <Card className="enchanted-parchment-dark flex items-center p-4 space-x-4 hover:shadow-primary/20 transition-shadow duration-300">
      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          src={house.crest}
          alt={`${house.name} 紋章`}
          width={64}
          height={64}
          data-ai-hint={house.dataAiHint}
          className="rounded-full border-2 border-[hsl(var(--border))] object-cover w-16 h-16"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold font-headline text-primary">{house.name}</h3>
        <p className="text-sm text-muted-foreground">
          組分け日: {new Date(result.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href={`/quiz/result/${result.houseName.toLowerCase()}?id=${result.id}`}>
            詳細を見る
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(result.id)}
          title="記録を削除"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default function HistoryPage() {
  const [history, setHistory] = useState<UserQuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = () => {
    const results = getStoredQuizResults();
    setHistory(results);
    setIsLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = (id: string) => {
    deleteQuizResult(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('過去の組分け記録をすべて消去しますか？')) {
      clearQuizResults();
      setHistory([]);
    }
  };

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
          <div className="flex justify-between items-center px-1">
            <span className="text-sm text-muted-foreground">合計 {history.length} 回の組分け記録</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="text-xs text-destructive border-destructive/40 hover:bg-destructive/10"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> 全記録を消去
            </Button>
          </div>
          {history.map((result) => (
            <HistoryItem key={result.id} result={result} onDelete={handleDelete} />
          ))}
          <div className="text-center pt-4">
            <Button asChild className="button-burgundy">
              <Link href="/quiz">
                <RotateCcw className="mr-2 h-4 w-4" />
                もう一度組分けを受ける
              </Link>
            </Button>
          </div>
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
