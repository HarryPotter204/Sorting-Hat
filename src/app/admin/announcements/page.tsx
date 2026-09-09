"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Megaphone, PlusCircle, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Announcement } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const loadAnnouncements = useCallback(async () => {
    try {
      const response = await fetch("/api/announcements", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load announcements");
      const data = await response.json();
      setAnnouncements(
        Array.isArray(data.announcements) ? data.announcements : [],
      );
    } catch {
      setAnnouncements([]);
      toast({
        title: "お知らせを読み込めませんでした",
        description: "Firestoreの接続設定を確認してください。",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    void loadAnnouncements();
  }, [loadAnnouncements]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast({
        title: "入力が不足しています",
        description: "タイトルと内容の両方を入力してください。",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), message: message.trim() }),
      });
      if (!response.ok) throw new Error("Failed to create announcement");
      const data = await response.json();
      setAnnouncements((prev) => [data.announcement, ...prev]);
      setTitle("");
      setMessage("");
      toast({
        title: "お知らせを発信しました！",
        description: `「${data.announcement.title}」を全生徒に向けて掲示しました。`,
      });
    } catch {
      toast({
        title: "お知らせを発信できませんでした",
        description: "Firestoreの接続または管理者認証を確認してください。",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    try {
      const response = await fetch(
        `/api/announcements?id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Failed to delete announcement");
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      toast({
        title: "お知らせを削除しました",
        description: `「${itemTitle}」を魔法掲示板から撤去しました。`,
      });
    } catch {
      toast({
        title: "お知らせを削除できませんでした",
        description: "Firestoreの接続または管理者認証を確認してください。",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-in-up">
      <header className="mb-8">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/admin">&larr; 管理ダッシュボードに戻る</Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary">
          魔法界ニュース管理
        </h1>
        <p className="text-muted-foreground">
          ホグワーツの魔法ネットワークで、重要ニュースを発信・管理しよう！
        </p>
      </header>

      <Card className="mb-8 enchanted-parchment-dark">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <Megaphone className="mr-2 h-5 w-5" />
            新しい魔法掲示を作成
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label
                htmlFor="announcement-title"
                className="block text-sm font-medium text-foreground mb-1"
              >
                タイトル
              </label>
              <Input
                id="announcement-title"
                placeholder="例：寮杯セレモニーの日程について"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
            <div>
              <label
                htmlFor="announcement-message"
                className="block text-sm font-medium text-foreground mb-1"
              >
                内容
              </label>
              <Textarea
                id="announcement-message"
                rows={3}
                placeholder="全生徒へ向けた魔法のメッセージを入力..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
            <Button type="submit" className="button-burgundy">
              <PlusCircle className="mr-2 h-4 w-4" /> 魔法のお知らせを発信！
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-headline text-primary">
          公開中のお知らせ ({announcements.length})
        </h2>
        {announcements.length === 0 ? (
          <p className="text-muted-foreground">
            現在掲示されているお知らせはありません。
          </p>
        ) : (
          announcements.map((anno) => (
            <Card key={anno.id} className="enchanted-parchment-dark">
              <CardHeader>
                <CardTitle className="font-headline text-lg text-foreground flex items-center justify-between">
                  <span>{anno.title}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    公開日: {anno.date}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 whitespace-pre-wrap mb-4">
                  {anno.message}
                </p>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleDelete(anno.id, anno.title)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" /> 削除
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
