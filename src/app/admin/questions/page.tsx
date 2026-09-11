"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  PlusCircle,
  Trash2,
  RotateCcw,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  Pencil,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  QuizQuestion,
  HouseName,
  HOUSE_NAMES,
  QuizOptionDraft,
  QuizQuestionDraft,
} from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useQuiz } from "@/context/QuizContext";
import { cn } from "@/lib/utils";

async function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  const response = await fetch("/api/quiz-questions", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Quiz questions request failed: ${response.status}`);
  }
  const data: { questions?: QuizQuestion[] } = await response.json();
  if (!Array.isArray(data.questions)) {
    throw new Error("Invalid quiz questions response");
  }
  return data.questions;
}

const HOUSE_OPTIONS: { house: HouseName; label: string; color: string }[] = [
  {
    house: "Gryffindor",
    label: "グリフィンドール向け選択肢",
    color: "text-red-400",
  },
  {
    house: "Ravenclaw",
    label: "レイブンクロー向け選択肢",
    color: "text-blue-400",
  },
  {
    house: "Hufflepuff",
    label: "ハッフルパフ向け選択肢",
    color: "text-yellow-400",
  },
  {
    house: "Slytherin",
    label: "スリザリン向け選択肢",
    color: "text-emerald-400",
  },
];

const HOUSE_AFFINITY_LABELS: Record<
  HouseName,
  { label: string; color: string }
> = {
  Gryffindor: { label: "G", color: "text-red-400" },
  Ravenclaw: { label: "R", color: "text-blue-400" },
  Hufflepuff: { label: "H", color: "text-yellow-400" },
  Slytherin: { label: "S", color: "text-emerald-400" },
};

function toDraft(question: QuizQuestion): QuizQuestionDraft {
  return {
    text: question.text,
    isActive: question.isActive ?? true,
    options: question.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
      houseAffinity: {
        Gryffindor: opt.houseAffinity.Gryffindor ?? 0,
        Ravenclaw: opt.houseAffinity.Ravenclaw ?? 0,
        Hufflepuff: opt.houseAffinity.Hufflepuff ?? 0,
        Slytherin: opt.houseAffinity.Slytherin ?? 0,
      },
      reason: opt.reason ?? "",
    })),
  };
}

function createEmptyOption(house: HouseName): QuizOptionDraft {
  return {
    id: "",
    text: "",
    houseAffinity: {
      Gryffindor: house === "Gryffindor" ? 3 : 0,
      Ravenclaw: house === "Ravenclaw" ? 3 : 0,
      Hufflepuff: house === "Hufflepuff" ? 3 : 0,
      Slytherin: house === "Slytherin" ? 3 : 0,
    },
    reason: "",
  };
}

function AffinityStepper({
  house,
  value,
  onChange,
}: {
  house: HouseName;
  value: number;
  onChange: (delta: number) => void;
}) {
  const { label, color } = HOUSE_AFFINITY_LABELS[house];
  return (
    <div className="flex items-center gap-1">
      <span className={cn("text-xs font-bold w-4", color)}>{label}</span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={() => onChange(-1)}
        disabled={value <= 0}
        title={`${house}のAffinityを減らす`}
      >
        −
      </Button>
      <span className="w-6 text-center text-xs font-mono">{value}</span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={() => onChange(1)}
        title={`${house}のAffinityを増やす`}
      >
        ＋
      </Button>
    </div>
  );
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newOptions, setNewOptions] = useState<QuizOptionDraft[]>(() =>
    HOUSE_OPTIONS.map((h) => createEmptyOption(h.house)),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<QuizQuestionDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const { toast } = useToast();
  const { reloadQuestions } = useQuiz();

  useEffect(() => {
    void fetchQuizQuestions()
      .then(setQuestions)
      .catch((error) => console.error("Failed to load quiz questions", error));
  }, []);

  // ---- 追加フォーム ----
  const updateNewOptionText = (optionIndex: number, text: string) => {
    setNewOptions((prev) =>
      prev.map((opt, i) => (i === optionIndex ? { ...opt, text } : opt)),
    );
  };

  const updateNewOptionReason = (optionIndex: number, reason: string) => {
    setNewOptions((prev) =>
      prev.map((opt, i) => (i === optionIndex ? { ...opt, reason } : opt)),
    );
  };

  const updateNewOptionAffinity = (
    optionIndex: number,
    house: HouseName,
    delta: number,
  ) => {
    setNewOptions((prev) =>
      prev.map((opt, i) => {
        if (i !== optionIndex) return opt;
        const current = opt.houseAffinity[house] ?? 0;
        const next = Math.max(0, current + delta);
        return {
          ...opt,
          houseAffinity: { ...opt.houseAffinity, [house]: next },
        };
      }),
    );
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) {
      toast({
        title: "質問文を入力してください",
        variant: "destructive",
      });
      return;
    }

    const missingOption = newOptions.find((opt) => !opt.text.trim());
    if (missingOption) {
      toast({
        title: "すべての選択肢を入力してください",
        description: "選択肢のテキストが入力されていません。",
        variant: "destructive",
      });
      return;
    }

    const qId = "q_custom_" + Date.now();
    const newQuestion: QuizQuestion = {
      id: qId,
      text: newQuestionText.trim(),
      order: questions.length + 1,
      isActive: true,
      options: newOptions.map((opt, i) => ({
        id: `${qId}_opt_${i + 1}`,
        text: opt.text.trim(),
        houseAffinity: { ...opt.houseAffinity },
        reason:
          opt.reason.trim() ||
          `${opt.text.trim()}を選んだあなたは、各寮らしさが表れています。`,
      })),
    };

    try {
      const response = await fetch("/api/quiz-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion),
      });
      if (!response.ok) {
        throw new Error(`Quiz question save failed: ${response.status}`);
      }
      const updated = await fetchQuizQuestions();
      setQuestions(updated);
      reloadQuestions();
    } catch (error) {
      console.error("Failed to save quiz question", error);
      return;
    }

    setNewQuestionText("");
    setNewOptions(HOUSE_OPTIONS.map((h) => createEmptyOption(h.house)));
    setIsAddFormOpen(false);

    toast({
      title: "質問を追加しました！",
      description: `新しい質問「${newQuestion.text.substring(0, 20)}...」を診断に追加しました。`,
    });
  };

  // ---- 編集フォーム ----
  const handleEdit = (q: QuizQuestion) => {
    setEditingId(q.id);
    setDraft(toDraft(q));
  };

  const handleCancel = () => {
    setEditingId(null);
    setDraft(null);
  };

  const updateDraftText = (text: string) => {
    setDraft((prev) => (prev ? { ...prev, text } : prev));
  };

  const updateDraftIsActive = (isActive: boolean) => {
    setDraft((prev) => (prev ? { ...prev, isActive } : prev));
  };

  const updateDraftOptionText = (optionIndex: number, text: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const options = prev.options.map((opt, i) =>
        i === optionIndex ? { ...opt, text } : opt,
      );
      return { ...prev, options };
    });
  };

  const updateDraftOptionReason = (optionIndex: number, reason: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const options = prev.options.map((opt, i) =>
        i === optionIndex ? { ...opt, reason } : opt,
      );
      return { ...prev, options };
    });
  };

  const updateDraftAffinity = (
    optionIndex: number,
    house: HouseName,
    delta: number,
  ) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const options = prev.options.map((opt, i) => {
        if (i !== optionIndex) return opt;
        const current = opt.houseAffinity[house] ?? 0;
        const next = Math.max(0, current + delta);
        return {
          ...opt,
          houseAffinity: { ...opt.houseAffinity, [house]: next },
        };
      });
      return { ...prev, options };
    });
  };

  const handleSave = async () => {
    if (!editingId || !draft) return;
    if (!draft.text.trim()) {
      toast({
        title: "質問文を入力してください",
        variant: "destructive",
      });
      return;
    }
    const missingOption = draft.options.find((opt) => !opt.text.trim());
    if (missingOption) {
      toast({
        title: "すべての選択肢を入力してください",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/quiz-questions?id=${encodeURIComponent(editingId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: draft.text.trim(),
            isActive: draft.isActive,
            options: draft.options.map((opt) => ({
              id: opt.id,
              text: opt.text.trim(),
              houseAffinity: opt.houseAffinity,
              reason: opt.reason.trim(),
            })),
          }),
        },
      );
      if (!response.ok) {
        throw new Error(`Quiz question update failed: ${response.status}`);
      }
      const updated = await fetchQuizQuestions();
      setQuestions(updated);
      reloadQuestions();
      setEditingId(null);
      setDraft(null);
      toast({ title: "質問を更新しました" });
    } catch (error) {
      console.error("Failed to update quiz question", error);
      toast({
        title: "更新に失敗しました",
        description: "時間をおいて再度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ---- 並び替え ----
  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= questions.length || isReordering) {
      return;
    }

    const current = questions[index];
    const target = questions[targetIndex];
    const currentOrder = current.order ?? index + 1;
    const targetOrder = target.order ?? targetIndex + 1;

    // 楽観的更新
    const optimistic = [...questions];
    optimistic[index] = { ...target, order: currentOrder };
    optimistic[targetIndex] = { ...current, order: targetOrder };
    setQuestions(optimistic);
    setIsReordering(true);

    try {
      await Promise.all([
        fetch(`/api/quiz-questions?id=${encodeURIComponent(current.id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: targetOrder }),
        }),
        fetch(`/api/quiz-questions?id=${encodeURIComponent(target.id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: currentOrder }),
        }),
      ]);
      const fresh = await fetchQuizQuestions();
      setQuestions(fresh);
      reloadQuestions();
    } catch (error) {
      console.error("Failed to reorder questions", error);
      setQuestions(questions);
      toast({
        title: "並び替えに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsReordering(false);
    }
  };

  // ---- 有効/無効トグル（即時保存） ----
  const handleToggleActive = async (q: QuizQuestion, isActive: boolean) => {
    // 楽観的更新
    setQuestions((prev) =>
      prev.map((item) => (item.id === q.id ? { ...item, isActive } : item)),
    );

    try {
      const response = await fetch(
        `/api/quiz-questions?id=${encodeURIComponent(q.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive }),
        },
      );
      if (!response.ok) {
        throw new Error(`Quiz question update failed: ${response.status}`);
      }
      reloadQuestions();
    } catch (error) {
      console.error("Failed to toggle isActive", error);
      setQuestions((prev) =>
        prev.map((item) =>
          item.id === q.id ? { ...item, isActive: !isActive } : item,
        ),
      );
      toast({
        title: "有効/無効の切り替えに失敗しました",
        variant: "destructive",
      });
    }
  };

  // ---- 削除 ----
  const handleDelete = async (id: string, text: string) => {
    if (questions.length <= 3) {
      toast({
        title: "削除できません",
        description: "診断精度を保つため、最低3問以上の質問が必要です。",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/quiz-questions?id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        throw new Error(`Quiz question delete failed: ${response.status}`);
      }
      const updated = await fetchQuizQuestions();
      setQuestions(updated);
      reloadQuestions();
    } catch (error) {
      console.error("Failed to delete quiz question", error);
      return;
    }
    toast({
      title: "質問を削除しました",
      description: `「${text.substring(0, 20)}...」を削除しました。`,
    });
  };

  // ---- リセット ----
  const handleReset = async () => {
    if (
      window.confirm(
        "質問リストをホグワーツ公式のデフォルト質問（7問）にリセットしますか？",
      )
    ) {
      try {
        const resetResponse = await fetch("/api/quiz-questions/reset", {
          method: "POST",
        });
        if (!resetResponse.ok) {
          throw new Error(`Question reset failed: ${resetResponse.status}`);
        }

        const questionsResponse = await fetch("/api/quiz-questions", {
          cache: "no-store",
        });
        if (!questionsResponse.ok) {
          throw new Error(
            `Question reload failed: ${questionsResponse.status}`,
          );
        }

        const data: { questions?: QuizQuestion[] } =
          await questionsResponse.json();
        if (!Array.isArray(data.questions)) {
          throw new Error("Invalid questions response");
        }

        setQuestions(data.questions);
        setEditingId(null);
        setDraft(null);
        toast({
          title: "デフォルトに戻しました",
          description: "初期設定のホグワーツ公式質問リストを復元しました。",
        });
      } catch (error) {
        console.error("Failed to reset quiz questions", error);
      }
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-in-up">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button variant="outline" asChild className="mb-4">
            <Link href="/admin">&larr; 管理ダッシュボードに戻る</Link>
          </Button>
          <h1 className="text-3xl font-headline font-bold text-primary">
            組分け帽子クイズの管理
          </h1>
          <p className="text-muted-foreground">
            組分け帽子の診断質問を追加・編集・並び替え・有効/無効切り替えできます。
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <Button
            onClick={() => setIsAddFormOpen((v) => !v)}
            className="button-burgundy"
          >
            <PlusCircle className="mr-1.5 h-4 w-4" /> 質問を追加
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="text-xs border-border"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> 公式質問にリセット
          </Button>
        </div>
      </header>

      {/* 新規質問追加フォーム（折りたたみ式） */}
      {isAddFormOpen && (
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
                <label
                  htmlFor="new-question-text"
                  className="block text-sm font-medium text-foreground mb-1"
                >
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

              <div className="space-y-4 pt-2">
                {newOptions.map((opt, optIndex) => (
                  <div
                    key={optIndex}
                    className="p-3 rounded-lg border border-border/60 bg-background/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-foreground">
                        選択肢 {optIndex + 1}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {HOUSE_OPTIONS[optIndex]?.label}
                      </span>
                    </div>
                    <Input
                      placeholder="選択肢のテキスト"
                      value={opt.text}
                      onChange={(e) =>
                        updateNewOptionText(optIndex, e.target.value)
                      }
                      className="bg-background/60 text-sm mb-2"
                    />
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      {HOUSE_NAMES.map((house) => (
                        <AffinityStepper
                          key={house}
                          house={house}
                          value={opt.houseAffinity[house] ?? 0}
                          onChange={(delta) =>
                            updateNewOptionAffinity(optIndex, house, delta)
                          }
                        />
                      ))}
                    </div>
                    <Textarea
                      rows={1}
                      placeholder="理由（結果画面に表示）"
                      value={opt.reason}
                      onChange={(e) =>
                        updateNewOptionReason(optIndex, e.target.value)
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
      )}

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

        {questions.map((q, index) => {
          const isEditing = editingId === q.id;
          const isFirst = index === 0;
          const isLast = index === questions.length - 1;

          return (
            <Card key={q.id} className="enchanted-parchment-dark">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleMove(index, -1)}
                        disabled={isFirst || isReordering}
                        title="上に移動"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleMove(index, 1)}
                        disabled={isLast || isReordering}
                        title="下に移動"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <CardTitle className="font-headline text-lg text-foreground">
                      第 {index + 1} 問
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">
                        {q.isActive === false ? "無効" : "有効"}
                      </span>
                      <Switch
                        checked={q.isActive !== false}
                        onCheckedChange={(checked) =>
                          handleToggleActive(q, checked)
                        }
                      />
                    </div>
                    {!isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleEdit(q)}
                        title="質問を編集"
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" /> 編集
                      </Button>
                    )}
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
                </div>
              </CardHeader>
              <CardContent>
                {isEditing && draft ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        質問文
                      </label>
                      <Textarea
                        rows={2}
                        value={draft.text}
                        onChange={(e) => updateDraftText(e.target.value)}
                        className="bg-background/50 border-border"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        有効
                      </span>
                      <Switch
                        checked={draft.isActive}
                        onCheckedChange={updateDraftIsActive}
                      />
                    </div>
                    <div className="space-y-4">
                      {draft.options.map((opt, optIndex) => (
                        <div
                          key={opt.id}
                          className="p-3 rounded-lg border border-border/60 bg-background/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-foreground">
                              選択肢 {optIndex + 1}
                            </span>
                          </div>
                          <Input
                            placeholder="選択肢のテキスト"
                            value={opt.text}
                            onChange={(e) =>
                              updateDraftOptionText(optIndex, e.target.value)
                            }
                            className="bg-background/60 text-sm mb-2"
                          />
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            {HOUSE_NAMES.map((house) => (
                              <AffinityStepper
                                key={house}
                                house={house}
                                value={opt.houseAffinity[house] ?? 0}
                                onChange={(delta) =>
                                  updateDraftAffinity(optIndex, house, delta)
                                }
                              />
                            ))}
                          </div>
                          <Textarea
                            rows={1}
                            placeholder="理由（結果画面に表示）"
                            value={opt.reason}
                            onChange={(e) =>
                              updateDraftOptionReason(optIndex, e.target.value)
                            }
                            className="bg-background/60 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="button-burgundy"
                      >
                        <Check className="mr-1.5 h-4 w-4" />
                        {isSaving ? "保存中..." : "保存"}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        disabled={isSaving}
                      >
                        <X className="mr-1.5 h-4 w-4" /> キャンセル
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-foreground mb-3">{q.text}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt) => {
                        const affinities = HOUSE_NAMES.map((house) => {
                          const score = opt.houseAffinity[house] ?? 0;
                          return score > 0
                            ? `${HOUSE_AFFINITY_LABELS[house].label}+${score}`
                            : null;
                        })
                          .filter(Boolean)
                          .join(", ");
                        return (
                          <div
                            key={opt.id}
                            className="text-xs p-2.5 rounded bg-background/40 border border-border/40 flex flex-col justify-between"
                          >
                            <span className="text-foreground/90 mb-1">
                              {opt.text}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {affinities || "汎用"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}