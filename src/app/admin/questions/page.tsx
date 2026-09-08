"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, RotateCcw, HelpCircle } from "lucide-react";
import Link from "next/link";
import { QuizQuestion, HouseName } from "@/lib/types";
import {
  getStoredQuestions,
  saveNewQuestion,
  deleteQuestion,
  resetQuestionsToDefault,
} from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useQuiz } from "@/context/QuizContext";

const HOUSE_OPTIONS: { house: HouseName; label: string; color: string }[] = [
  { house: "Gryffindor", label: "グリフィンドール向け選択肢", color: "text-red-400" },
  { house: "Ravenclaw", label: "レイブンクロー向け選択肢", color: "text-blue-400" },
  { house: "Hufflepuff", label: "ハッフルパフ向け選択肢", color: "text-yellow-400" },
  { house: "Slytherin", label: "スリザリン向け選択肢", color: "text-emerald-400" },
];

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [optionTexts, setOptionTexts] = useState<Record<HouseName, string>>({
    Gryffindor: "",
    Ravenclaw: "",
    Hufflepuff: "",
    Slytherin: "",
  });
  const { toast } = useToast();
  const { reloadQuestions } = useQuiz();

  useEffect(() => {
    setQuestions(getStoredQuestions());
  }, []);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) {
      toast({
        title: "質問文を入力してください",
        variant: "destructive",
      });
      return;
    }

    const missingOption = HOUSE_OPTIONS.find((h) => !optionTexts[h.house].trim());
    if (missingOption) {
      toast({
        title: "すべての選択肢を入力してください",
        description: `【${missingOption.label}】が入力されていません。`,
        variant: "destructive",
      });
      return;
    }

    const qId = "q_custom_" + Date.now();
    const newQuestion: QuizQuestion = {
      id: qId,
      text: newQuestionText.trim(),
      options: HOUSE_OPTIONS.map((h, i) => ({
        id: `${qId}_opt_${i + 1}`,
        text: optionTexts[h.house].trim(),
        houseAffinity: {
          [h.house]: 3,
        },
      })),
    };

    const updated = saveNewQuestion(newQuestion);
    setQuestions(updated);
    reloadQuestions();

    setNewQuestionText("");
    setOptionTexts({
      Gryffindor: "",
      Ravenclaw: "",
      Hufflepuff: "",
      Slytherin: "",
    });

    toast({
      title: "質問を追加しました！",
      description: `新しい質問「${newQuestion.text.substring(0, 20)}...」を診断に追加しました。`,
    });
  };

  const handleDelete = (id: string, text: string) => {
    if (questions.length <= 3) {
      toast({
        title: "削除できません",
        description: "診断精度を保つため、最低3問以上の質問が必要です。",
        variant: "destructive",
      });
      return;
    }

    const updated = deleteQuestion(id);
    setQuestions(updated);
    reloadQuestions();
    toast({
      title: "質問を削除しました",
      description: `「${text.substring(0, 20)}...」を削除しました。`,
    });
  };

  const handleReset = () => {
    if (window.confirm("質問リストをホグワーツ公式のデフォルト質問（7問）にリセットしますか？")) {
      const reset = resetQuestionsToDefault();
      setQuestions(reset);
      reloadQuestions();
      toast({
        title: "デフォルトに戻しました",
        description: "初期設定のホグワーツ公式質問リストを復元しました。",
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-in-up">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button variant="outline" asChild className="mb-4">
            <Link href="/admin">&larr; 管理ダッシュボードに戻る</Link>
          </Button>
          <h1 className="text-3xl font-headline font-bold text-primary">組分け帽子クイズの管理</h1>
          <p className="text-muted-foreground">組分け帽子の診断質問を追加・編集・削除できます。</p>
        </div>
        <Button onClick={handleReset} variant="outline" className="text-xs self-start sm:self-auto border-border">
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> 公式質問にリセット
        </Button>
      </header>

      {/* 新規質問追加カード */}
      <Card className="mb-8 enchanted-parchment-dark">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <PlusCircle className="mr-2 h-5 w-5" /> 新しい質問を追加
          </CardTitle>
          <CardDescription>
            質問文と、各寮の気質（勇気、知恵、忠誠、野心）に応じた4つの選択肢を設定します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div>
              <label htmlFor="new-question-text" className="block text-sm font-medium text-foreground mb-1">
                質問文
              </label>
              <Textarea
                id="new-question-text"
                rows={2}
                placeholder="例：もしも夜の禁じられた森で不思議な光を見かけたら、あなたはどうしますか？"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {HOUSE_OPTIONS.map((h) => (
                <div key={h.house} className="p-3 rounded-lg border border-border/60 bg-background/30">
                  <label className={`block text-xs font-semibold mb-1 ${h.color}`}>
                    {h.label}
                  </label>
                  <Input
                    placeholder={`例：${h.house === 'Gryffindor' ? '杖を抜いて迷わず調査に向かう' : h.house === 'Ravenclaw' ? '図書館の禁書棚で関連文献を調べる' : h.house === 'Hufflepuff' ? '信頼できる仲間を呼んで共に確認する' : '有利な魔法遺物がないか警戒しつつ探る'}`}
                    value={optionTexts[h.house]}
                    onChange={(e) =>
                      setOptionTexts((prev) => ({ ...prev, [h.house]: e.target.value }))
                    }
                    className="bg-background/60 text-sm"
                  />
                </div>
              ))}
            </div>

            <Button type="submit" className="button-burgundy mt-2">
              <PlusCircle className="mr-2 h-4 w-4" /> 質問を追加して診断に反映
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 既存質問一覧 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-headline text-primary">
            現在の診断質問 ({questions.length}問)
          </h2>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" /> 診断には全問が出題されます
          </span>
        </div>

        {questions.map((q, index) => (
          <Card key={q.id} className="enchanted-parchment-dark">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="font-headline text-lg text-foreground">
                  第 {index + 1} 問: {q.text}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(q.id, q.text)}
                  title="質問を削除"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> 削除
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {q.options.map((opt) => {
                  const affinities = Object.entries(opt.houseAffinity || {})
                    .map(([house, score]) => `${house} +${score}`)
                    .join(", ");
                  return (
                    <div
                      key={opt.id}
                      className="text-xs p-2.5 rounded bg-background/40 border border-border/40 flex flex-col justify-between"
                    >
                      <span className="text-foreground/90 mb-1">{opt.text}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {affinities || "汎用"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
