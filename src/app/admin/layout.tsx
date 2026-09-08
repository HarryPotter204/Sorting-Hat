"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, KeyRound, ShieldAlert, LogOut, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { isAdminAuthenticated, setAdminAuthenticated } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { SortingHatIcon } from "@/components/icons/HouseIcons";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedId = adminId.trim().toLowerCase();
    const trimmedPw = password.trim().toLowerCase();

    // Valid admin credentials:
    // ID: admin, dumbledore, hogwarts
    // Password: alohomora, hogwarts, magic123
    const isValidId = trimmedId === "admin" || trimmedId === "dumbledore" || trimmedId === "hogwarts";
    const isValidPw = trimmedPw === "alohomora" || trimmedPw === "hogwarts" || trimmedPw === "magic123";

    if (isValidId && isValidPw) {
      setAdminAuthenticated(true);
      setAuthenticated(true);
      toast({
        title: "アロホモラ！解錠成功",
        description: "ホグワーツ管理府へようこそ。教職員・校長権限を付与しました。",
      });
    } else {
      setErrorMessage("管理者IDまたは合言葉（パスワード）が正しくありません。「アロホモラ」が弾かれました。");
      toast({
        title: "認証失敗",
        description: "合言葉または管理者IDが違います。",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setAuthenticated(false);
    setAdminId("");
    setPassword("");
    toast({
      title: "ログアウトしました",
      description: "管理区画から退出しました。",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <Lock className="h-8 w-8 text-primary animate-pulse" />
        <p className="text-muted-foreground text-sm">ホグワーツ管理府の防護呪文を確認中...</p>
      </div>
    );
  }

  // If not authenticated, display login gate
  if (!authenticated) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-fade-in-up">
        <Card className="w-full max-w-md enchanted-parchment-dark border border-primary/40 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center mb-3 text-primary">
              <Lock className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
            </div>
            <CardTitle className="font-headline text-2xl text-primary flex items-center justify-center gap-2">
              ホグワーツ管理府 厳重封鎖
            </CardTitle>
            <CardDescription className="text-foreground/80 text-sm mt-1">
              校長室および教職員専用の管理領域です。立ち入るには管理者IDと合言葉を入力してください。
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {errorMessage && (
              <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/15 text-destructive text-sm flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/90 uppercase tracking-wider mb-1.5">
                  管理者ID
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="例: admin"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                    className="bg-background/60 border-border text-foreground pr-10"
                  />
                  <KeyRound className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/90 uppercase tracking-wider mb-1.5">
                  合言葉（パスワード）
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="合言葉を入力 (例: alohomora)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/60 border-border text-foreground pr-10"
                  />
                  <Lock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <Button type="submit" className="w-full button-gold py-5 text-base font-semibold shadow-lg">
                アロホモラ（解錠して入室）
              </Button>
            </form>

            <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/10 text-xs text-foreground/85 space-y-1">
              <p className="font-semibold text-primary flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> 認可された認証情報
              </p>
              <p className="text-muted-foreground">
                管理者ID: <span className="text-primary font-mono font-medium">admin</span>
              </p>
              <p className="text-muted-foreground">
                パスワード: <span className="text-primary font-mono font-medium">alohomora</span> または <span className="text-primary font-mono font-medium">hogwarts</span>
              </p>
            </div>

            <div className="text-center pt-2">
              <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
                <Link href="/" className="flex items-center gap-1.5">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  大広間（ホーム）に戻る
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // When authenticated, render admin header and children
  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Admin Top Status Bar */}
      <div className="w-full bg-primary/10 border-b border-primary/20 backdrop-blur-sm px-4 py-2.5 mb-6">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
              ● 管理者認証中
            </span>
            <span className="text-foreground/80 hidden sm:inline">
              ホグワーツ管理府（校長・教職員モード）
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-primary hover:underline font-medium"
            >
              ダッシュボード
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/admin/announcements"
              className="text-primary hover:underline font-medium"
            >
              掲示板投稿
            </Link>
            <span className="text-border">|</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-3.5 w-3.5 mr-1" />
              ログアウト
            </Button>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
