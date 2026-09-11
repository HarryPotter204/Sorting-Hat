"use client";

import type { QuizQuestion } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];
const toRoman = (n: number) => ROMAN[n - 1] ?? String(n);

interface QuestionCardProps {
  question: QuizQuestion;
  onAnswer: (questionId: string, optionId: string) => void;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId?: string;
  isTransitioning?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  isTransitioning = false,
}) => {
  return (
    <Card className="w-full max-w-lg mx-auto enchanted-parchment-dark shadow-2xl border border-primary/40 rounded-2xl overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-2 text-center relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 font-headline">
            第 {toRoman(questionNumber)} 問 ／ 全 {totalQuestions} 問
          </span>
        </div>

        <CardTitle className="flex h-16 items-center overflow-hidden text-left font-headline text-xl leading-snug text-foreground line-clamp-2 sm:h-14 sm:text-2xl">
          {question.text}
        </CardTitle>
      </CardHeader>

      {question.imageUrl && (
        <div className="px-4 sm:px-6 py-2">
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-border/80 shadow-md">
            <Image
              src={question.imageUrl}
              alt={question.dataAiHint || `質問 ${questionNumber} のイラスト`}
              fill
              className="object-cover"
              data-ai-hint={question.dataAiHint}
              priority
            />
          </div>
        </div>
      )}

      <CardContent className="p-4 sm:p-6 pt-3">
        <p className="text-xs text-muted-foreground mb-3 text-left">
          直感で当てはまる選択肢をタップしてください：
        </p>
        <div className="space-y-2.5">
          {question.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                disabled={isTransitioning}
                onClick={() => onAnswer(question.id, option.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between gap-3 text-sm sm:text-base font-medium shadow-sm select-none active:scale-[0.98] min-h-[56px]",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/40 shadow-lg scale-[1.01]"
                    : "bg-background/60 hover:bg-primary/10 text-foreground border-border/80 hover:border-primary/50",
                )}
                aria-pressed={isSelected}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border",
                      isSelected
                        ? "bg-primary-foreground text-primary border-primary-foreground"
                        : "bg-background/80 text-muted-foreground border-border",
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-snug">{option.text}</span>
                </div>
                {isSelected && (
                  <span className="text-xs shrink-0 font-bold animate-pulse">
                    ✓ 選択中
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
