"use client";

import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { QUIZ_QUESTIONS, HOGWARTS_HOUSES, HOUSE_NAMES_ARRAY } from '@/lib/constants';
import type { QuizState, HouseName, QuizQuestion } from '@/lib/types';

type QuizAction =
  | { type: 'START_QUIZ' }
  | { type: 'ANSWER_QUESTION'; questionId: string; optionId: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_QUIZ'; sortedHouse: HouseName }
  | { type: 'RETAKE_QUIZ' };

const initialQuizState: QuizState = {
  currentQuestionIndex: 0,
  answers: {},
  scores: HOUSE_NAMES_ARRAY.reduce((acc, houseName) => ({ ...acc, [houseName]: 0 }), {}),
  isCompleted: false,
  sortedHouse: null,
};

const QuizContext = createContext<{
  state: QuizState;
  dispatch: Dispatch<QuizAction>;
  questions: QuizQuestion[];
  currentQuestion: QuizQuestion | undefined;
  totalQuestions: number;
} | undefined>(undefined);

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...initialQuizState,
        scores: HOUSE_NAMES_ARRAY.reduce((acc, houseName) => ({ ...acc, [houseName]: 0 }), {}),
      };
    case 'ANSWER_QUESTION': {
      const currentQuestion = QUIZ_QUESTIONS[state.currentQuestionIndex];
      const selectedOption = currentQuestion.options.find(opt => opt.id === action.optionId);
      
      let newScores = { ...state.scores };
      if (selectedOption) {
        for (const house in selectedOption.houseAffinity) {
          newScores[house as HouseName] = (newScores[house as HouseName] || 0) + (selectedOption.houseAffinity[house as HouseName] || 0);
        }
      }
      
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: action.optionId,
        },
        scores: newScores,
      };
    }
    case 'NEXT_QUESTION': {
      if (state.currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
        return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };
      }
      // If it's the last question, determine the house
      let maxScore = -Infinity;
      let sortedHouse: HouseName | null = null;
      HOUSE_NAMES_ARRAY.forEach(houseName => {
        const score = state.scores[houseName] || 0;
        if (score > maxScore) {
          maxScore = score;
          sortedHouse = houseName;
        } else if (score === maxScore) {
          // Handle ties by randomly picking or predefined rule. For now, first one wins or could be random.
          // This simple tie-breaker picks the one that comes first in HOGWARTS_HOUSES definition if scores are equal
          // A more sophisticated tie-breaker could be implemented if needed
          if (sortedHouse && HOUSE_NAMES_ARRAY.indexOf(houseName) < HOUSE_NAMES_ARRAY.indexOf(sortedHouse)) {
            sortedHouse = houseName;
          } else if (!sortedHouse) {
             sortedHouse = houseName;
          }
        }
      });
       // If no scores, default to a random house or Hufflepuff for kindness
      if (!sortedHouse) {
        sortedHouse = HOUSE_NAMES_ARRAY[Math.floor(Math.random() * HOUSE_NAMES_ARRAY.length)];
      }
      return { ...state, isCompleted: true, sortedHouse: sortedHouse as HouseName };
    }
    case 'COMPLETE_QUIZ': // This action might be dispatched externally if sorting happens elsewhere
      return { ...state, isCompleted: true, sortedHouse: action.sortedHouse };
    case 'RETAKE_QUIZ':
      return {
        ...initialQuizState,
        scores: HOUSE_NAMES_ARRAY.reduce((acc, houseName) => ({ ...acc, [houseName]: 0 }), {}),
      };
    default:
      return state;
  }
};

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const questions = QUIZ_QUESTIONS;
  const currentQuestion = questions[state.currentQuestionIndex];
  const totalQuestions = questions.length;

  return (
    <QuizContext.Provider value={{ state, dispatch, questions, currentQuestion, totalQuestions }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
