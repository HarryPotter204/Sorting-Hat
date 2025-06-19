"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HOGWARTS_HOUSES } from '@/lib/constants';
import type { UserQuizResult, HouseName } from '@/lib/types';
import { ListCollapse, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// Mock data - in a real app, this would come from a database
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
          src={`https://placehold.co/64x64/${house.colors.primaryHex.substring(1)}/${house.colors.secondaryHex.substring(1)}.png?text=${house.name.charAt(0)}`} 
          alt={`${house.name} Crest`} 
          width={64} 
          height={64} 
          data-ai-hint={house.dataAiHint}
          className="rounded-full border-2 border-[hsl(var(--border))]"
        />
      <div className="flex-grow">
        <h3 className="text-lg font-semibold font-headline text-primary">{house.name}</h3>
        <p className="text-sm text-muted-foreground">Sorted on: {new Date(result.date).toLocaleDateString()}</p>
      </div>
      {/* Placeholder for score details or view button */}
       <Link href={`/quiz/result/${house.name.toLowerCase()}`} passHref>
         <Button variant="outline" size="sm" className="text-xs">View Details</Button>
       </Link>
    </Card>
  );
};

export default function HistoryPage() {
  const [history, setHistory] = useState<UserQuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    // In a real app: check if user is logged in, then fetch their history.
    setTimeout(() => {
      setHistory(MOCK_HISTORY.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-in-up">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-3">
          Your Sorting History
        </h1>
        <p className="text-lg text-foreground/80 max-w-xl mx-auto">
          Revisit your past encounters with the Sorting Hat and see how your journey through Hogwarts has unfolded.
        </p>
      </header>

      {isLoading ? (
        <div className="text-center text-primary">Loading your magical history... <ListCollapse className="inline-block animate-spin h-5 w-5 ml-2" /></div>
      ) : history.length > 0 ? (
        <div className="space-y-6 max-w-2xl mx-auto">
          {history.map((result) => (
            <HistoryItem key={result.id} result={result} />
          ))}
        </div>
      ) : (
        <Card className="enchanted-parchment-dark text-center py-10 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">The Scroll is Blank!</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg text-foreground/80 mb-6">
              You haven't been sorted yet. Take the quiz to begin your Hogwarts story!
            </CardDescription>
            <Button asChild className="button-burgundy">
              <Link href="/quiz">
                <RotateCcw className="mr-2 h-4 w-4" />
                Take the Sorting Quiz
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
