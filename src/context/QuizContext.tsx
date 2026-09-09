"use client";

import React, { createContext, useContext, useReducer, ReactNode, Dispatch, useEffect } from 'react';
import { QUIZ_QUESTIONS, HOUSE_NAMES_ARRAY } from '@/lib/constants';
import type { QuizState, HouseName, QuizQuestion } from '@/lib/types';
import { getStoredQuestions, getSavedNickname } from '@/lib/storage';

type QuizAction =
  | { type: 'SET_QUESTIONS'; questions: QuizQuestion[] }
  | { type: 'SET_NICKNAME'; nickname: string }
  | { type: 'START_QUIZ'; nickname?: string }
  | { type: 'ANSWER_QUESTION'; questionId: string; optionId: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'COMPLETE_QUIZ'; sortedHouse: HouseName }
  | { type: 'RETAKE_QUIZ' };

interface ExtendedQuizState extends QuizState {
  questionsList: QuizQuestion[];
}

const calculateScores = (questions: QuizQuestion[], answers: Record<string, string>): Record<HouseName, number> => {
  const scores = HOUSE_NAMES_ARRAY.reduce((acc, houseName) => ({ ...acc, [houseName]: 0 }), {} as Record<HouseName, number>);
  questions.forEach(q => {
    const chosenOptionId = answers[q.id];
    if (chosenOptionId) {
      const option = q.options.find(opt => opt.id === chosenOptionId);
      if (option) {
        for (const house in option.houseAffinity) {
          scores[house as HouseName] = (scores[house as HouseName] || 0) + (option.houseAffinity[house as HouseName] || 0);
        }
      }
    }
  });
  return scores;
};

const initialQuizState: ExtendedQuizState = {
  nickname: '',
  currentQuestionIndex: 0,
  answers: {},
  scores: HOUSE_NAMES_ARRAY.reduce((acc, houseName) => ({ ...acc, [houseName]: 0 }), {}),
  isCompleted: false,
  sortedHouse: null,
  questionsList: QUIZ_QUESTIONS,
};


const QuizContext = createContext<{
  state: ExtendedQuizState;
  dispatch: Dispatch<QuizAction>;
  questions: QuizQuestion[];
  currentQuestion: QuizQuestion | undefined;
  totalQuestions: number;
  reloadQuestions: () => void;
} | undefined>(undefined);

const quizReducer = (state: ExtendedQuizState, action: QuizAction): ExtendedQuizState => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return {
        ...state,
        questionsList: action.questions,
      };
    case 'SET_NICKNAME':
      return {
        ...state,
        nickname: action.nickname,
      };
    case 'START_QUIZ':
      return {
        ...initialQuizState,
        nickname: action.nickname ?? state.nickname,
        questionsList: state.questionsList,
        scores: HOUSE_NAMES_ARRAY.reduce((acc, houseName) => ({ ...acc, [houseName]: 0 }), {}),
      };
    case 'ANSWER_QUESTION': {

      const newAnswers = {
        ...state.answers,
        [action.questionId]: action.optionId,
      };
      const newScores = calculateScores(state.questionsList, newAnswers);
      return {
        ...state,
        answers: newAnswers,
        scores: newScores,
      };
    }
    case 'PREV_QUESTION': {
      if (state.currentQuestionIndex > 0) {
        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex - 1,
          isCompleted: false,
          sortedHouse: null,
        };
      }
      return state;
    }
    case 'NEXT_QUESTION': {
      const qList = state.questionsList;
      if (state.currentQuestionIndex < qList.length - 1) {
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
          if (sortedHouse && HOUSE_NAMES_ARRAY.indexOf(houseName) < HOUSE_NAMES_ARRAY.indexOf(sortedHouse)) {
            sortedHouse = houseName;
          } else if (!sortedHouse) {
             sortedHouse = houseName;
          }
        }
      });
      if (!sortedHouse) {
        sortedHouse = HOUSE_NAMES_ARRAY[Math.floor(Math.random() * HOUSE_NAMES_ARRAY.length)];
      }
      return { ...state, isCompleted: true, sortedHouse: sortedHouse as HouseName };
    }
    case 'COMPLETE_QUIZ':
      return { ...state, isCompleted: true, sortedHouse: action.sortedHouse };
    case 'RETAKE_QUIZ':
      return {
        ...initialQuizState,
        nickname: state.nickname || getSavedNickname(),
        questionsList: state.questionsList,
        scores: HOUSE_NAMES_ARRAY.reduce((acc, houseName) => ({ ...acc, [houseName]: 0 }), {}),
      };

    default:
      return state;
  }
};


export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);

  const reloadQuestions = () => {
    const loaded = getStoredQuestions();
    dispatch({ type: 'SET_QUESTIONS', questions: loaded });
  };

  useEffect(() => {
    reloadQuestions();
    const saved = getSavedNickname();
    if (saved) {
      dispatch({ type: 'SET_NICKNAME', nickname: saved });
    }
  }, []);

  const questions = state.questionsList;
  const currentQuestion = questions[state.currentQuestionIndex];
  const totalQuestions = questions.length;

  return (
    <QuizContext.Provider value={{ state, dispatch, questions, currentQuestion, totalQuestions, reloadQuestions }}>
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
