// src/app/admin/announcements/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Megaphone, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";

const MOCK_ANNOUNCEMENTS = [
    {id: "anno1", title: "まもなく寮対抗カップのセレモニーが始まります！", message: "校長先生より、寮杯セレモニーが次の金曜日の夜、グレートホールにて執り行われると告げられました。先輩諸君、寮の準備を整えて臨んでください！", date: new Date().toLocaleDateString()},
    {id: "anno2", title: "クィディッチ選抜、開催延期のお知らせ", message: "「暴走ブラッジャーが出現したとの報告により、悪天候の中でのトライアウトは延期となります。再開は追ってお知らせします。", date: new Date(Date.now() - 1000*60*60*24).toLocaleDateString()},
];

export default function AdminAnnouncementsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <header className="mb-8">
         <Button variant="outline" asChild className="mb-4">
          <Link href="/admin">&larr; Back to Admin Dashboard</Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary">魔法界ニュース</h1>
        <p className="text-muted-foreground">ホグワーツの魔法ネットワークで、重要ニュースを発信しよう！</p>
      </header>

      <Card className="mb-8 enchanted-parchment-dark">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center"><Megaphone className="mr-2 h-5 w-5"/>新しい魔法掲示を作成</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="announcement-title" className="block text-sm font-medium text-foreground mb-1">Title</label>
            <Input id="announcement-title" placeholder="Enter announcement title..." className="bg-background/50 border-border"/>
          </div>
          <div>
            <label htmlFor="announcement-message" className="block text-sm font-medium text-foreground mb-1">Message</label>
            <Textarea id="announcement-message" placeholder="Enter announcement message..." className="bg-background/50 border-border"/>
          </div>
          <Button className="button-burgundy">
            <PlusCircle className="mr-2 h-4 w-4" /> 魔法のお知らせを発信！
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-headline text-primary">Published Announcements</h2>
        {MOCK_ANNOUNCEMENTS.map(anno => (
          <Card key={anno.id} className="enchanted-parchment-dark">
            <CardHeader>
              <CardTitle className="font-headline text-lg text-foreground">{anno.title}</CardTitle>
              <CardDescription className="text-muted-foreground">公開日: {anno.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">{anno.message}</p>
               <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" className="text-xs">編集</Button>
                <Button variant="destructive" size="sm" className="text-xs"><Trash2 className="mr-1 h-3 w-3"/>削除</Button>
            </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
