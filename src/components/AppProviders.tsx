"use client";

import React from 'react';
import { QuizProvider } from '@/context/QuizContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return <QuizProvider>{children}</QuizProvider>;
};

export default AppProviders;
