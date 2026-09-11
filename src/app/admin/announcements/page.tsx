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
import { Switch } from "@/components/ui/switch";
import {
  Megaphone,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Bot,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Announcement } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import type { AnnouncementAutomationSettings } from "@/lib/types";

// Formats an ISO timestamp for the admin display (JST, short).
function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [automation, setAutomation] =
    useState<AnnouncementAutomationSettings | null>(null);
  const [automationLoading, setAutomationLoading] = useState(true);
  const [automationSaving, setAutomationSaving] = useState(false);
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

  const loadAutomation = useCallback(async () => {
    try {
      const response = await fetch("/api/announcements/automation", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to load automation settings");
      const data = await response.json();
      setAutomation(data.settings ?? null);
    } catch {
      setAutomation(null);
    } finally {
      setAutomationLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAutomation();
  }, [loadAutomation]);

  const handleToggleAutomation = async (enabled: boolean) => {
    setAutomationSaving(true);
    try {
      const response = await fetch("/api/announcements/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!response.ok) throw new Error("Failed to update automation");
      const data = await response.json();
      setAutomation(data.settings ?? null);
      toast({
        title: enabled
          ? "🟢 掲示板自動投稿を開始しました"
          : "⚪ 掲示板自動投稿を停止しました",
        description: enabled
          ? "約5〜10分ごとに新しいお知らせが自動投稿されます。"
          : "自動投稿は停止されました。既存の投稿は削除されていません。",
      });
    } catch {
      toast({
        title: "設定を保存できませんでした",
        description: "Firestoreの接続または管理者認証を確認してください。",
        variant: "destructive",
      });
    } finally {
      setAutomationSaving(false);
    }
  };

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
            <Bot className="mr-2 h-5 w-5" />
            掲示板自動投稿
          </CardTitle>
          <CardDescription className="text-foreground/80">
            ONにすると、約5〜10分ごとにランダムな間隔で短いお知らせが自動投稿されます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {automationLoading ? (
            <p className="text-sm text-muted-foreground">
              自動投稿の設定を読み込んでいます...
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-primary/30 bg-background/40 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${
                        automation?.enabled
                          ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                          : "bg-muted-foreground/50"
                      }`}
                    />
                    <span className="font-headline font-bold text-lg text-primary">
                      {automation?.enabled ? "🟢 ON" : "⚪ OFF"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {automation?.enabled
                      ? "約5〜10分ごとに自動投稿します"
                      : "自動投稿は停止中です"}
                  </p>
                </div>
                <Switch
                  checked={automation?.enabled === true}
                  disabled={automationSaving}
                  onCheckedChange={(checked) => handleToggleAutomation(checked)}
                  aria-label="掲示板自動投稿の切り替え"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-foreground/80">
                <div className="flex items-center gap-2 rounded-lg bg-background/40 border border-border/60 px-3 py-2">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    最終自動投稿：
                    <span className="font-semibold ml-1">
                      {formatDateTime(automation?.lastRunAt ?? null)}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-background/40 border border-border/60 px-3 py-2">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    次回予定時刻：
                    <span className="font-semibold ml-1">
                      {automation?.enabled
                        ? formatDateTime(automation?.nextRunAt ?? null)
                        : "—"}
                    </span>
                  </span>
                </div>
              </div>
              {automation?.updatedAt && (
                <p className="text-[11px] text-muted-foreground">
                  設定の最終更新：{formatDateTime(automation.updatedAt)}
                  {automation.updatedBy ? `（${automation.updatedBy}）` : ""}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
