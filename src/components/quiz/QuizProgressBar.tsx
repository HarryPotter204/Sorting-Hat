"use client";

import { Progress } from '@/components/ui/progress';

interface QuizProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const QuizProgressBar: React.FC<QuizProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto my-8 p-2 rounded-lg shadow-md enchanted-parchment">
      <div className="flex justify-between text-xs font-medium text-gray-700 mb-1 px-1">
        <span>The Sorting Hat Ponders...</span>
        <span>{currentStep} / {totalSteps}</span>
      </div>
      <Progress value={progressPercentage} className="h-3 bg-gray-300 [&>div]:bg-primary" />
      <style jsx>{`
        .enchanted-parchment {
          background-image: url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23c9a87b' fill-opacity='0.2'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414zM41.95 17.536l8.484 8.484 1.415-1.413-8.484-8.484-1.415 1.413zM22.212 4.712l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};
