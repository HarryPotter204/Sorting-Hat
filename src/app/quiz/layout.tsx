"use client";

import { QuizProvider } from '@/context/QuizContext';

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QuizProvider>{children}</QuizProvider>;
}
