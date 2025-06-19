"use client";

import React from 'react';
// import { ThemeProvider } from 'next-themes'; // If you want to add theme switching
// import { QuizProvider } from '@/context/QuizContext'; // Example provider

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  // Wrap children with any context providers needed application-wide
  // For now, it's a simple pass-through.
  // Example:
  // return (
  //   <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
  //     <QuizProvider>
  //       {children}
  //     </QuizProvider>
  //   </ThemeProvider>
  // );
  return <>{children}</>;
};

export default AppProviders;
