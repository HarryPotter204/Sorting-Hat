// src/app/admin/questions/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QUIZ_QUESTIONS } from "@/lib/constants";
import { PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AdminQuestionsPage() {
  // これはプレースホルダーです。完全なCRUD機能は状態管理やバックエンド呼び出しが必要です。
  const questions = QUIZ_QUESTIONS;

  return (
    <div className="container mx-auto py-10 px-4">
      <header className="mb-8">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/admin">&larr; 管理ダッシュボードに戻る</Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary">組分け帽子クイズの管理</h1>
        <p className="text-muted-foreground">組分け帽子の質問を追加・編集・削除できます。</p>
      </header>

      <Card className="mb-8 enchanted-parchment-dark">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">新しい質問を追加</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="new-question-text" className="block text-sm font-medium text-foreground mb-1">質問文</label>
            <Textarea id="new-question-text" placeholder="質問を入力してください..." className="bg-background/50 border-border"/>
          </div>
          {/* 選択肢や寮との親和性のフィールドをここに追加 */}
          <Button className="button-burgundy">
            <PlusCircle className="mr-2 h-4 w-4" /> 質問を追加
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-headline text-primary">既存の質問 ({questions.length})</h2>
        {questions.map((q, index) => (
          <Card key={q.id} className="enchanted-parchment-dark">
            <CardHeader>
              <CardTitle className="font-headline text-lg text-foreground">質問 {index + 1}: {q.text}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {q.options.map(opt => (
                  <li key={opt.id}>{opt.text} （親和性: {JSON.stringify(opt.houseAffinity)}）</li>
                ))}
              </ul>
            </CardContent>
            <CardContent className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" className="text-xs">編集</Button>
                <Button variant="destructive" size="sm" className="text-xs"><Trash2 className="mr-1 h-3 w-3"/>削除</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
