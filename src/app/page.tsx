
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HOGWARTS_HOUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Wand2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const houses = Object.values(HOGWARTS_HOUSES);

  return (
    <div className="flex flex-col items-center text-center space-y-12 py-8 animate-fade-in-up">
      <header className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-primary">
          ハリポタ組分け帽子診断！
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto">
          Answer the ancient questions of the Sorting Hat and find where you truly belong in the magical world of Hogwarts.
        </p>
        <Button asChild size="lg" className="button-burgundy text-lg px-8 py-6 shadow-lg hover:shadow-accent/50 transition-all duration-300 transform hover:scale-105">
          <Link href="/quiz">
            <Wand2 className="mr-2 h-6 w-6" />
            Begin the Sorting Ceremony
          </Link>
        </Button>
      </header>

      <section className="w-full max-w-5xl space-y-8">
        <h2 className="text-3xl font-headline text-primary/90">The Four Noble Houses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {houses.map((house) => (
            <Card key={house.name} className={cn("enchanted-parchment-dark overflow-hidden group", `theme-${house.name.toLowerCase()}`)}>
              <CardHeader className="items-center p-4 bg-[hsl(var(--house-primary,_var(--card)))] text-[hsl(var(--house-secondary,_var(--card-foreground)))]">
                <div className="relative w-24 h-24 mb-2">
                   <Image
                    src={house.crest}
                    alt={`${house.name} Crest`}
                    width={100}
                    height={100}
                    data-ai-hint={house.dataAiHint}
                    className="rounded-full border-2 border-[hsl(var(--house-secondary))] group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="font-headline text-2xl">{house.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-sm">
                <CardDescription className="text-foreground/80">
                  <strong className="text-[hsl(var(--house-secondary))]">Values:</strong> {house.values.join(', ')}.
                </CardDescription>
                <p className="mt-2 text-xs text-muted-foreground">Founded by {house.founder}.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-full max-w-3xl">
         <Card className="enchanted-parchment-dark">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">What Awaits You?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-left text-foreground/90">
            <p>Embark on a journey of self-discovery. Our carefully crafted questions delve into your personality, choices, and deepest values to determine your rightful place.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Interactive and engaging quiz experience.</li>
              <li>Beautifully designed results with house lore.</li>
              <li>AI-powered magical facts about your house.</li>
              <li>Track your sorting history (coming soon for logged-in wizards!).</li>
            </ul>
            <p>The magic of Hogwarts is calling. Are you ready to answer?</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
