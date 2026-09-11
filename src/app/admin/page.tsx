import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Users, MessageSquare, Edit3 } from "lucide-react";

const adminSections = [
  { title: "組分けクイズの管理", description: "組分けクイズの質問を追加・編集・削除できます。", href: "/admin/questions", icon: Edit3 },
  { title: "組分け統計の監視", description: "寮別の組分け結果の統計を確認できます。", href: "/admin/stats", icon: Users },
  { title: "AI生成の寮情報の管理", description: "AIが生成した寮の情報を確認し、承認・却下できます。", href: "/admin/facts", icon: BookOpen },
  { title: "魔法の告知", description: "全ユーザーに告知を送信できます（例：寮対抗カップの更新など）。", href: "/admin/announcements", icon: MessageSquare },
];

export default function AdminDashboardPage() {
  // 本来は認証や権限チェックをここに追加する必要があります。
  // 現在はオープンページです。

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-in-up">
      <header className="text-center mb-10 space-y-2">
        <p className="font-display text-[10px] sm:text-xs tracking-[0.4em] text-primary/80 uppercase">
          Staff Room
        </p>
        <div className="ornament-rule" aria-hidden="true">
          <span className="text-[10px]">✦</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-1">
          教職員室 ― 魔法管理パネル
        </h1>
        <p className="text-sm md:text-lg text-foreground/80 max-w-xl mx-auto">
          ホグワーツ組分けアプリの魔法的な機能を管理できます。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {adminSections.map((section) => (
          <Card key={section.title} className="enchanted-parchment-dark hover:shadow-primary/20 transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <section.icon className="h-8 w-8 text-primary" />
                <CardTitle className="font-headline text-2xl text-primary">{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-foreground/80 mb-4">{section.description}</CardDescription>
              <Button asChild variant="outline" className="text-primary border-primary hover:bg-primary/10">
                <Link href={section.href}>このセクションへ</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-12">
        不用意な操作は、瞬間移動でダンブルドア校長の部屋に呼ばれるか、フロバーウォームに変えられるかも…
      </p>
    </div>
  );
}
