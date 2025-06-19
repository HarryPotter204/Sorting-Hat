"use client";

import type { QuizQuestion, HouseName } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: QuizQuestion;
  onAnswer: (questionId: string, optionId: string) => void;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
  selectedOptionId,
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto enchanted-parchment-dark animate-fade-in-up shadow-2xl">
      <CardHeader>
        <CardDescription className="text-primary font-semibold">
          Question {questionNumber} of {totalQuestions}
        </CardDescription>
        <CardTitle className="font-headline text-2xl md:text-3xl text-foreground">
          {question.text}
        </CardTitle>
      </CardHeader>
      {question.imageUrl && (
        <div className="px-6 py-4">
          <Image
            src={question.imageUrl}
            alt={question.dataAiHint || `Illustration for question ${questionNumber}`}
            width={600}
            height={400}
            className="rounded-md object-cover w-full aspect-video border border-border"
            data-ai-hint={question.dataAiHint}
          />
        </div>
      )}
      <CardContent>
        <div className="space-y-4">
          {question.options.map((option) => (
            <Button
              key={option.id}
              variant={selectedOptionId === option.id ? "default" : "outline"}
              size="lg"
              className={cn(
                "w-full justify-start text-left h-auto py-3 px-4 transition-all duration-200 transform hover:scale-[1.02]",
                 selectedOptionId === option.id ? 
                 'bg-primary text-primary-foreground border-primary ring-2 ring-primary ring-offset-2 ring-offset-background' :
                 'bg-background/30 hover:bg-accent/20 text-foreground hover:text-accent-foreground border-border'
              )}
              onClick={() => onAnswer(question.id, option.id)}
              aria-pressed={selectedOptionId === option.id}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
