"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import { generateHouseFacts, GenerateHouseFactsInput } from '@/ai/flows/generate-house-facts';
import type { HouseName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AIFactGeneratorProps {
  houseName: HouseName;
}

export const AIFactGenerator: React.FC<AIFactGeneratorProps> = ({ houseName }) => {
  const [fact, setFact] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleGenerateFact = async () => {
    setIsLoading(true);
    setFact('');
    try {
      const input: GenerateHouseFactsInput = { house: houseName };
      const result = await generateHouseFacts(input);
      if (result && result.fact) {
        setFact(result.fact);
      } else {
        toast({
          title: "うーん、精霊たちは静かです…",
          description: "今は魔法の豆知識を取得できません。もう一度試してください！",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating fact:", error);
      toast({
        title: "野生のエルンプトが現れた！",
        description: "豆知識を召喚中に何か問題が発生しました。もう一度試してください。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-md enchanted-parchment-dark", `theme-${houseName.toLowerCase()}`)}>
      <CardHeader>
        <CardTitle className="font-headline text-xl text-[hsl(var(--house-primary))]">魔法の豆知識ジェネレーター</CardTitle>
        <CardDescription className="text-muted-foreground">
          {houseName}に関するAI生成のユニークな豆知識を見つけよう！
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerateFact} disabled={isLoading} className="w-full button-gold">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isLoading ? '豆知識を召喚中...' : '豆知識を表示'}
        </Button>
        {fact && (
          <div className="p-3 bg-background/20 rounded-md border border-border animate-fade-in-up">
            <p className="text-sm text-foreground">{fact}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
