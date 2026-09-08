"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, BookOpenText, PlusCircle, Filter } from "lucide-react";
import Link from "next/link";
import { FactItem, getStoredFacts, updateFactStatus, addStoredFact } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const HOUSES = ["グリフィンドール", "スリザリン", "レイブンクロー", "ハッフルパフ"];

export default function AdminFactsPage() {
  const [facts, setFacts] = useState<FactItem[]>([]);
  const [selectedHouse, setSelectedHouse] = useState(HOUSES[0]);
  const [newFactText, setNewFactText] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const { toast } = useToast();

  useEffect(() => {
    setFacts(getStoredFacts());
  }, []);

  const handleStatusChange = (id: string, status: "approved" | "rejected" | "pending") => {
    const updated = updateFactStatus(id, status);
    setFacts(updated);
    toast({
      title: status === "approved" ? "豆知識を承認しました" : status === "rejected" ? "豆知識を却下しました" : "ステータスを更新しました",
      description: "AI豆知識の表示判定に即時反映されます。",
    });
  };

  const handleAddFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactText.trim()) return;

    const updated = addStoredFact(selectedHouse, newFactText.trim());
    setFacts(updated);
    setNewFactText("");
    toast({
      title: "豆知識を登録しました",
      description: `【${selectedHouse}】の公式情報として承認・登録されました。`,
    });
  };

  const filteredFacts = facts.filter((fact) => {
    if (filterStatus === "all") return true;
    return fact.status === filterStatus;
  });

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-in-up">
      <header className="mb-8">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/admin">&larr; 管理ダッシュボードに戻る</Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary">AI生成・魔法情報の管理</h1>
        <p className="text-muted-foreground">魔法豆知識の内容が正確で、ホグワーツの伝承に忠実であることを確認・管理します。</p>
      </header>

      {/* 新規追加フォーム */}
      <Card className="mb-8 enchanted-parchment-dark">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <PlusCircle className="mr-2 h-5 w-5" /> 新しい寮の豆知識を登録
          </CardTitle>
          <CardDescription>各寮の秘密や歴史、生徒たちの逸話を追加できます。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddFact} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {HOUSES.map((h) => (
                <Button
                  key={h}
                  type="button"
                  size="sm"
                  variant={selectedHouse === h ? "default" : "outline"}
                  onClick={() => setSelectedHouse(h)}
                  className={selectedHouse === h ? "button-gold" : "text-xs"}
                >
                  {h}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="豆知識の内容を入力してください..."
                value={newFactText}
                onChange={(e) => setNewFactText(e.target.value)}
                className="bg-background/50 border-border"
              />
              <Button type="submit" className="button-burgundy whitespace-nowrap">
                登録する
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* フィルタータブ */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground mr-2">絞り込み:</span>
        {(["all", "pending", "approved", "rejected"] as const).map((status) => (
          <Button
            key={status}
            size="sm"
            variant={filterStatus === status ? "secondary" : "ghost"}
            onClick={() => setFilterStatus(status)}
            className="text-xs capitalize"
          >
            {status === "all" ? "すべて" : status === "pending" ? "保留中" : status === "approved" ? "承認済" : "却下"}
          </Button>
        ))}
      </div>

      {/* リスト表示 */}
      <div className="space-y-4">
        {filteredFacts.map((fact) => (
          <Card key={fact.id} className="enchanted-parchment-dark">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="font-headline text-lg text-foreground flex items-center">
                  <BookOpenText className="mr-2 h-5 w-5 text-primary" />
                  {fact.house}の伝承
                </CardTitle>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    fact.status === "approved"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : fact.status === "rejected"
                      ? "bg-rose-500/20 text-rose-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {fact.status === "approved" ? "承認済み" : fact.status === "rejected" ? "却下" : "保留中"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 mb-4">{fact.text}</p>
              <div className="flex space-x-2 justify-end">
                {fact.status !== "approved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(fact.id, "approved")}
                    className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 text-xs"
                  >
                    <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> 承認する
                  </Button>
                )}
                {fact.status !== "rejected" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(fact.id, "rejected")}
                    className="border-rose-500/50 text-rose-400 hover:bg-rose-500/10 text-xs"
                  >
                    <XCircle className="mr-1.5 h-3.5 w-3.5" /> 却下する
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
