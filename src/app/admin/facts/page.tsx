// src/app/admin/facts/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, BookOpenText } from "lucide-react";
import Link from "next/link";

const MOCK_AI_FACTS = [
  { id: "fact1", house: "グリフィンドール", text: "グリフィンドールの談話室は、城の高い塔の上にあります。", status: "pending" },
  { id: "fact2", house: "スリザリン", text: "スリザリン寮の談話室の合言葉は、毎隔週ごとに新しくなります。", status: "approved" },
  { id: "fact3", house: "レイブンクロー", text: "レイブンクローの塔に入るには、合言葉ではなく、なぞなぞに挑戦する必要があります。", status: "pending" },
  { id: "fact4", house: "ハッフルパフ", text: "ハッフルパフ寮の談話室は台所のすぐそばにあり、温かく落ち着ける雰囲気で知られています。", status: "rejected" },
];

export default function AdminFactsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <header className="mb-8">
         <Button variant="outline" asChild className="mb-4">
          <Link href="/admin">&larr; 管理ダッシュボードに戻る</Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary">AI生成の魔法情報を管理</h1>
        <p className="text-muted-foreground">魔法情報が正確で魅力的であることを確認しましょう。</p>
      </header>

      <div className="space-y-6">
        {MOCK_AI_FACTS.map(fact => (
          <Card key={fact.id} className="enchanted-parchment-dark">
            <CardHeader>
              <CardTitle className="font-headline text-lg text-foreground flex items-center">
                <BookOpenText className="mr-2 h-5 w-5 text-primary"/>
                {fact.house}の情報
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                ステータス: <span className={`font-semibold ${fact.status === 'approved' ? 'text-green-400' : fact.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>{fact.status === 'approved' ? '承認済み' : fact.status === 'rejected' ? '却下' : '保留中'}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">{fact.text}</p>
              {fact.status === "pending" && (
                <div className="flex space-x-2 justify-end">
                  <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
                    <CheckCircle className="mr-2 h-4 w-4" /> 承認
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                    <XCircle className="mr-2 h-4 w-4" /> 却下
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
       <p className="text-center text-sm text-muted-foreground mt-12">
        このサイトはテストだよ！
      </p>
    </div>
  );
}
