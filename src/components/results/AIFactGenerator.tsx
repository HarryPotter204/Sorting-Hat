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
          title: "Hmm, the spirits are quiet...",
          description: "Couldn't fetch a magical fact right now. Try again!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating fact:", error);
      toast({
        title: "A wild Erumpent appeared!",
        description: "Something went wrong while conjuring a fact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-md enchanted-parchment-dark", `theme-${houseName.toLowerCase()}`)}>
      <CardHeader>
        <CardTitle className="font-headline text-xl text-[hsl(var(--house-primary))]">Magical Fact Generator</CardTitle>
        <CardDescription className="text-muted-foreground">
          Discover a unique AI-generated fact about {houseName}!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerateFact} disabled={isLoading} className="w-full button-gold">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Conjuring Fact...' : 'Reveal a Fact!'}
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
