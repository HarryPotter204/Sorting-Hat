"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuiz } from '@/context/QuizContext';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { QuizProgressBar } from '@/components/quiz/QuizProgressBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Sparkles, Home, UserCheck, Edit3 } from 'lucide-react';
import { saveQuizResult, getSavedNickname, saveNickname, completeSortingProcess } from '@/lib/storage';
import Link from 'next/link';

export default function QuizPage() {
  const { state, dispatch, currentQuestion, totalQuestions } = useQuiz();
  const router = useRouter();

  const [savedNick, setSavedNick] = useState('');
  const [hasStarted, setHasStarted] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = getSavedNickname();
      if (stored) return true;
    }
    return Boolean(state.nickname) || state.currentQuestionIndex > 0 || Object.keys(state.answers).length > 0;
  });

  const [nicknameInput, setNicknameInput] = useState(state.nickname || '');
  const [isEditingNick, setIsEditingNick] = useState(false);
  const [editNickInput, setEditNickInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isCompletingRef = useRef(false);

  // Initialize saved nickname on client mount
  useEffect(() => {
    const stored = getSavedNickname();
    if (stored) {
      setSavedNick(stored);
      if (!state.nickname) {
        dispatch({ type: 'SET_NICKNAME', nickname: stored });
      }
      setHasStarted(true);
    }
  }, [state.nickname, dispatch]);

  // Sync selectedOption with current question's existing answer (e.g. after going back)
  useEffect(() => {
    if (currentQuestion && state.answers[currentQuestion.id]) {
      setSelectedOption(state.answers[currentQuestion.id]);
    } else {
      setSelectedOption(undefined);
    }
  }, [currentQuestion, state.currentQuestionIndex, state.answers]);

  // Clean up any pending transition timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // When quiz is completed, save, update leaderboard stats, post to bulletin board, and redirect
  useEffect(() => {
    if (state.isCompleted && state.sortedHouse && !isCompletingRef.current) {
      isCompletingRef.current = true;
      const finalNick = state.nickname || getSavedNickname() || nicknameInput.trim() || '新入生';
      
      // Execute complete sorting workflow:
      // 1. Saves nickname to persistent storage
      // 2. Saves quiz result into history
      // 3. Immediately updates leaderboard counts (getAggregatedHouseCounts)
      // 4. Publishes sorting notice to the bulletin board (掲示板)
      const { result } = completeSortingProcess({
        nickname: finalNick,
        houseName: state.sortedHouse,
        scores: state.scores,
      });

      router.push(`/quiz/result/${state.sortedHouse.toLowerCase()}?id=${result.id}`);
    }
  }, [state.isCompleted, state.sortedHouse, state.scores, state.nickname, nicknameInput, router]);

  const handleStartQuiz = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalNick = nicknameInput.trim() || '新入生';
    saveNickname(finalNick);
    setSavedNick(finalNick);
    dispatch({ type: 'SET_NICKNAME', nickname: finalNick });
    dispatch({ type: 'START_QUIZ', nickname: finalNick });
    setHasStarted(true);
  };

  const handleSaveEditedNick = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = editNickInput.trim() || '新入生';
    saveNickname(updated);
    setSavedNick(updated);
    dispatch({ type: 'SET_NICKNAME', nickname: updated });
    setIsEditingNick(false);
  };

  // Nickname entry screen before starting
  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4 py-6 max-w-md mx-auto space-y-5 animate-fade-in-up">
        <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 my-1 flex items-center justify-center">
          <Image
            src="/images/hat.png"
            alt="ホグワーツ組分け帽子"
            width={180}
            height={180}
            priority
            className="w-full h-full object-contain rounded-2xl drop-shadow-xl select-none"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-primary">
            組分けの儀式
          </h1>
          <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
            「ホグワーツへようこそ！<br />まずはそなたの名前（ニックネーム）を教えておくれ…」
          </p>
        </div>

        <form onSubmit={handleStartQuiz} className="space-y-4 w-full">
          <div className="space-y-1.5 text-left">
            <label htmlFor="student-nickname" className="text-xs font-semibold text-primary block">
              あなたのニックネーム（お名前）
            </label>
            <Input
              id="student-nickname"
              type="text"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              placeholder="例: ハリー、ポッター、新入生"
              maxLength={20}
              className="h-12 bg-background/80 border-primary/40 rounded-xl text-center text-base"
              autoFocus
            />
          </div>

          <Button 
            type="submit"
            className="w-full button-gold py-6 text-base font-bold shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            <Sparkles className="mr-2 h-5 w-5 text-yellow-300" />
            組分け帽子をかぶる（診断開始）
          </Button>
        </form>

        <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
          <Link href="/">&larr; 大広間に戻る</Link>
        </Button>
      </div>
    );
  }
  
  if (state.isCompleted || !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4 py-10 max-w-md mx-auto space-y-6 animate-fade-in-up">
        <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 my-1 flex items-center justify-center">
          <Image
            src="/images/hat.png"
            alt="ホグワーツ組分け帽子"
            width={180}
            height={180}
            priority
            className="w-full h-full object-contain rounded-2xl drop-shadow-[0_0_25px_rgba(234,179,8,0.5)] animate-bounce"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xl font-headline font-bold text-primary">
            {state.nickname ? `「うーむ、${state.nickname}よ…決まったぞ！」` : '「うーむ…決まったぞ！そなたの行くべき寮は…」'}
          </p>
          <p className="text-xs text-muted-foreground">
            組分け帽子が宣誓の声を高らかに響かせています…
          </p>
        </div>
      </div>
    );
  }

  // Handle instant selection and auto-advancing to next question
  const handleAnswer = (questionId: string, optionId: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedOption(optionId);
    dispatch({ type: 'ANSWER_QUESTION', questionId, optionId });

    // Provide visual confirmation for 280ms before automatically advancing
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'NEXT_QUESTION' });
      setIsTransitioning(false);
    }, 280);
  };

  // Handle going back one question
  const handlePrevQuestion = () => {
    if (isTransitioning) return;
    if (state.currentQuestionIndex > 0) {
      dispatch({ type: 'PREV_QUESTION' });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 sm:space-y-6 py-2 sm:py-6 px-2 sm:px-4 max-w-lg mx-auto w-full animate-fade-in-up">
      {/* Student Badge & Progress Bar */}
      <div className="w-full space-y-2">
        {state.nickname ? (
          <div className="flex items-center justify-between px-1 text-xs text-primary/90">
            <div className="flex items-center gap-1 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-yellow-400" />
              <span>生徒: <strong className="text-primary">{state.nickname}</strong></span>
              {!isEditingNick ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditNickInput(state.nickname || '');
                    setIsEditingNick(true);
                  }}
                  className="text-[10px] text-muted-foreground hover:text-primary underline ml-1"
                  title="ニックネームを変更"
                >
                  (変更)
                </button>
              ) : null}
            </div>
            <span className="text-[11px] text-muted-foreground">
              問 {state.currentQuestionIndex + 1} / {totalQuestions}
            </span>
          </div>
        ) : null}

        {isEditingNick ? (
          <form onSubmit={handleSaveEditedNick} className="flex items-center gap-2 p-2 rounded-lg bg-card/90 border border-primary/30 text-xs">
            <span className="text-primary font-semibold shrink-0">名前変更:</span>
            <Input
              type="text"
              value={editNickInput}
              onChange={(e) => setEditNickInput(e.target.value)}
              className="h-7 text-xs bg-background"
              maxLength={20}
              autoFocus
            />
            <Button type="submit" size="sm" className="h-7 px-2 text-xs button-gold shrink-0">保存</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditingNick(false)} className="h-7 px-2 text-xs shrink-0">取消</Button>
          </form>
        ) : null}

        <QuizProgressBar currentStep={state.currentQuestionIndex + 1} totalSteps={totalQuestions} />
      </div>
      
      {/* Question Card with instant option tap */}
      <QuestionCard
        question={currentQuestion}
        onAnswer={handleAnswer}
        questionNumber={state.currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        selectedOptionId={selectedOption}
        isTransitioning={isTransitioning}
      />

      {/* Navigation Controls: Only Back button, no Next button */}
      <div className="w-full flex items-center justify-between pt-1 px-1">
        {state.currentQuestionIndex > 0 ? (
          <Button 
            onClick={handlePrevQuestion}
            variant="outline" 
            size="default"
            disabled={isTransitioning}
            className="border-primary/40 text-primary hover:bg-primary/10 h-11 px-4 text-sm font-medium shadow-sm transition-all"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            一つ戻る
          </Button>
        ) : (
          <Button 
            asChild
            variant="ghost" 
            size="default"
            className="text-muted-foreground hover:text-foreground h-11 px-3 text-xs"
          >
            <Link href="/">
              <Home className="mr-1.5 h-4 w-4" />
              大広間へ
            </Link>
          </Button>
        )}

        <div className="text-[11px] text-muted-foreground font-medium text-right">
          {isTransitioning ? (
            <span className="text-primary font-semibold animate-pulse">次の質問へ進行中…</span>
          ) : (
            <span>選択肢をタップして進行</span>
          )}
        </div>
      </div>
    </div>
  );
}


