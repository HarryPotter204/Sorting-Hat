// src/app/admin/questions/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QUIZ_QUESTIONS } from "@/lib/constants";
import { PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AdminQuestionsPage() {
  // This is a placeholder. Full CRUD functionality would require state management and backend calls.
  const questions = QUIZ_QUESTIONS;

  return (
    <div className="container mx-auto py-10 px-4">
      <header className="mb-8">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/admin">&larr; Back to Admin Dashboard</Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary">Manage Quiz Questions</h1>
        <p className="text-muted-foreground">Add, edit, or remove questions for the Sorting Hat.</p>
      </header>

      <Card className="mb-8 enchanted-parchment-dark">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Add New Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="new-question-text" className="block text-sm font-medium text-foreground mb-1">Question Text</label>
            <Textarea id="new-question-text" placeholder="Enter the question..." className="bg-background/50 border-border"/>
          </div>
          {/* Add fields for options and house affinities here */}
          <Button className="button-burgundy">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-headline text-primary">Existing Questions ({questions.length})</h2>
        {questions.map((q, index) => (
          <Card key={q.id} className="enchanted-parchment-dark">
            <CardHeader>
              <CardTitle className="font-headline text-lg text-foreground">Question {index + 1}: {q.text}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {q.options.map(opt => (
                  <li key={opt.id}>{opt.text} (Affinity: {JSON.stringify(opt.houseAffinity)})</li>
                ))}
              </ul>
            </CardContent>
            <CardContent className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" className="text-xs">Edit</Button>
                <Button variant="destructive" size="sm" className="text-xs"><Trash2 className="mr-1 h-3 w-3"/>Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
