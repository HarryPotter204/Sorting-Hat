"use client";

import { useEffect, useState } from "react";
import {
  isAdminAuthenticated,
  verifyAdminLogin,
  logoutAdmin,
} from "@/lib/storage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, KeyRound, ShieldAlert, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!adminId.trim() || !password.trim()) {
      setErrorMsg("IDと合言葉（パスワード）を両方入力してください。");
      return;
    }

    void (async () => {
      try {
        const response = await fetch("/api/admin/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: adminId, password }),
        });
        if (!response.ok) throw new Error("Admin session failed");
        verifyAdminLogin(adminId, password);
        setIsAuthenticated(true);
        toast({
          title: "アロホモラ！認証に成功しました",
          description: "ホグワーツ管理エリアへようこそ。",
        });
      } catch {
        setErrorMsg(
          "認証に失敗しました。Firebaseと管理者セッションの設定を確認してください。",
        );
      }
    })();
  };

  const handleLogout = () => {
    logoutAdmin();
    void fetch("/api/admin/session", { method: "DELETE" });
    setIsAuthenticated(false);
    toast({
      title: "ログアウトしました",
      description: "管理セッションを終了しました。",
    });
  };

  // While loading initial client state
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-primary animate-pulse text-sm">
          認証状態を確認中...
        </div>
      </div>
    );
  }

  // Not authenticated: Show Hogwarts Staff Login Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-6 sm:py-12 px-3 animate-fade-in-up">
        <Card className="enchanted-parchment-dark rounded-2xl border border-primary/40 shadow-2xl p-2 sm:p-4">
          <CardHeader className="text-center space-y-2 pb-4">
            <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center mx-auto text-primary">
              <Lock className="w-6 h-6 text-yellow-400" />
            </div>
            <CardTitle className="font-headline text-2xl font-bold text-primary">
              教職員・管理者認証
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
              管理者のページへ入るには、管理者IDと合言葉を入力してください。
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="admin-id"
                  className="text-xs font-semibold text-primary block"
                >
                  管理者ID
                </label>
                <div className="relative">
                  <Input
                    id="admin-id"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    placeholder="例: admin / dumbledore / hogwarts"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="bg-background/70 border-primary/40 text-sm h-11"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="admin-pass"
                  className="text-xs font-semibold text-primary block"
                >
                  合言葉（パスワード）
                </label>
                <div className="relative">
                  <Input
                    id="admin-pass"
                    type="password"
                    placeholder="例: alohomora / hogwarts / magic123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/70 border-primary/40 text-sm h-11"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-destructive/15 border border-destructive/40 text-destructive text-xs flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full button-burgundy py-5 text-sm sm:text-base font-bold rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all"
              >
                <KeyRound className="w-4 h-4 mr-2" />
                扉を開く（ログイン）
              </Button>

              <div className="pt-2 text-center">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <Link href="/">&larr; 大広間（ホーム）に戻る</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated: Show children with a clean top bar and logout option
  return (
    <div className="w-full">
      <div className="mb-4 p-2.5 px-3.5 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 text-primary font-medium">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>教職員認証済み（管理者権限）</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="h-8 px-2.5 text-xs border-primary/40 text-primary hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 mr-1" />
          ログアウト
        </Button>
      </div>
      {children}
    </div>
  );
}
