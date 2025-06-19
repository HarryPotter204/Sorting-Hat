import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Users, MessageSquare, Edit3 } from "lucide-react";

const adminSections = [
  { title: "Manage Quiz Questions", description: "Add, edit, or remove questions from the sorting quiz.", href: "/admin/questions", icon: Edit3 },
  { title: "Monitor Sorting Stats", description: "View statistics on house sorting results.", href: "/admin/stats", icon: Users },
  { title: "Moderate AI Facts", description: "Review and approve/reject AI-generated house facts.", href: "/admin/facts", icon: BookOpen },
  { title: "Magical Announcements", description: "Push announcements to all users (e.g., House Cup updates).", href: "/admin/announcements", icon: MessageSquare },
];

export default function AdminDashboardPage() {
  // In a real app, add authentication and authorization checks here.
  // For now, it's an open page.

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-in-up">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-3">
          Admin Spellbook Panel
        </h1>
        <p className="text-lg text-foreground/80 max-w-xl mx-auto">
          Manage the magical workings of the Hogwarts Sorting application.
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
                <Link href={section.href}>Go to Section</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-12">
        Access to this panel is restricted. Improper use may result in being turned into a Flobberworm.
      </p>
    </div>
  );
}
