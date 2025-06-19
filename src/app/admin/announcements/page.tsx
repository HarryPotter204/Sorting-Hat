// src/app/admin/announcements/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Megaphone, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";

const MOCK_ANNOUNCEMENTS = [
    {id: "anno1", title: "House Cup Ceremony Soon!", message: "The Headmaster announces the House Cup Ceremony will be held next Friday evening in the Great Hall. Prefects, please prepare your houses!", date: new Date().toLocaleDateString()},
    {id: "anno2", title: "Quidditch Tryouts Postponed", message: "Due to inclement weather (rogue Bludgers reported), Quidditch tryouts are postponed until further notice.", date: new Date(Date.now() - 1000*60*60*24).toLocaleDateString()},
];

export default function AdminAnnouncementsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <header className="mb-8">
         <Button variant="outline" asChild className="mb-4">
          <Link href="/admin">&larr; Back to Admin Dashboard</Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary">Magical Announcements</h1>
        <p className="text-muted-foreground">Broadcast important news across the Hogwarts digital realm.</p>
      </header>

      <Card className="mb-8 enchanted-parchment-dark">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center"><Megaphone className="mr-2 h-5 w-5"/>Create New Announcement</CardTitle>
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
            <PlusCircle className="mr-2 h-4 w-4" /> Publish Announcement
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-headline text-primary">Published Announcements</h2>
        {MOCK_ANNOUNCEMENTS.map(anno => (
          <Card key={anno.id} className="enchanted-parchment-dark">
            <CardHeader>
              <CardTitle className="font-headline text-lg text-foreground">{anno.title}</CardTitle>
              <CardDescription className="text-muted-foreground">Published on: {anno.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">{anno.message}</p>
               <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" className="text-xs">Edit</Button>
                <Button variant="destructive" size="sm" className="text-xs"><Trash2 className="mr-1 h-3 w-3"/>Delete</Button>
            </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
