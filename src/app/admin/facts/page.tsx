// src/app/admin/facts/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, BookOpenText } from "lucide-react";
import Link from "next/link";

const MOCK_AI_FACTS = [
  { id: "fact1", house: "Gryffindor", text: "Gryffindor's common room is located in one of the castle's highest towers.", status: "pending" },
  { id: "fact2", house: "Slytherin", text: "The password to the Slytherin common room changes every fortnight.", status: "approved" },
  { id: "fact3", house: "Ravenclaw", text: "To enter Ravenclaw Tower, one must answer a riddle rather than give a password.", status: "pending" },
  { id: "fact4", house: "Hufflepuff", text: "Hufflepuff's common room is near the kitchens and is known for its cozy atmosphere.", status: "rejected" },
];

export default function AdminFactsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <header className="mb-8">
         <Button variant="outline" asChild className="mb-4">
          <Link href="/admin">&larr; Back to Admin Dashboard</Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary">Moderate AI-Generated Facts</h1>
        <p className="text-muted-foreground">Ensure the magical facts are accurate and enchanting.</p>
      </header>

      <div className="space-y-6">
        {MOCK_AI_FACTS.map(fact => (
          <Card key={fact.id} className="enchanted-parchment-dark">
            <CardHeader>
              <CardTitle className="font-headline text-lg text-foreground flex items-center">
                <BookOpenText className="mr-2 h-5 w-5 text-primary"/>
                Fact for {fact.house}
              </CardTitle>
              <CardDescription className="text-muted-foreground">Status: <span className={`font-semibold ${fact.status === 'approved' ? 'text-green-400' : fact.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>{fact.status}</span></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">{fact.text}</p>
              {fact.status === "pending" && (
                <div className="flex space-x-2 justify-end">
                  <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
       <p className="text-center text-sm text-muted-foreground mt-12">
        Showing mock facts. Real moderation tools would interact with a database.
      </p>
    </div>
  );
}
