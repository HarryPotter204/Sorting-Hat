import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Crown, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HOGWARTS_HOUSES } from '@/lib/constants';
import type { HouseName } from '@/lib/types';
import { cn } from '@/lib/utils';

interface HousePageProps {
  params: Promise<{ houseName: string }>;
}

function getHouseName(slug: string): HouseName | undefined {
  return (Object.keys(HOGWARTS_HOUSES) as HouseName[]).find(
    (name) => name.toLowerCase() === slug.toLowerCase()
  );
}

export default async function HousePage({ params }: HousePageProps) {
  const { houseName: slug } = await params;
  const houseName = getHouseName(slug);

  if (!houseName) {
    notFound();
  }

  const house = HOGWARTS_HOUSES[houseName];
  const description = `${house.founder}によって創設された${house.name}は、${house.animal}を象徴とする寮です。${house.commonRoom}を談話室とし、${house.quote.split('\n')[0]}。`;

  return (
    <div
      className={cn(
        'mx-auto max-w-2xl space-y-5 py-4 sm:py-8 animate-fade-in-up',
        `theme-${houseName.toLowerCase()}`
      )}
    >
      <Button asChild variant="ghost" className="text-primary">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          四つの寮に戻る
        </Link>
      </Button>

      <Card className="enchanted-parchment-dark overflow-hidden rounded-2xl border border-primary/30">
        <CardHeader className="items-center space-y-4 bg-[hsl(var(--house-primary,_var(--card)))] px-4 py-6 text-center text-[hsl(var(--house-secondary,_var(--card-foreground)))] sm:px-8 sm:py-8">
          <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-[hsl(var(--house-secondary,_var(--card-foreground)))]/50 shadow-xl sm:h-44 sm:w-44">
            <Image
              src={house.crest}
              alt={`${house.name}の紋章`}
              fill
              sizes="(max-width: 640px) 144px, 176px"
              className="object-cover"
              priority
            />
          </div>
          <CardTitle className="font-headline text-3xl font-bold sm:text-4xl">
            {house.name}
          </CardTitle>
          <p className="max-w-xl whitespace-pre-line text-sm leading-relaxed opacity-90">
            {house.quote}
          </p>
        </CardHeader>

        <CardContent className="space-y-5 p-4 sm:p-8">
          <section className="space-y-2">
            <h2 className="flex items-center gap-2 font-headline text-xl font-bold text-primary">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              寮の説明
            </h2>
            <p className="text-sm leading-relaxed text-foreground/85">{description}</p>
          </section>

          <section className="space-y-2">
            <h2 className="flex items-center gap-2 font-headline text-xl font-bold text-primary">
              <ShieldCheck className="h-5 w-5" />
              大切にしている価値観
            </h2>
            <div className="flex flex-wrap gap-2">
              {house.values.map((value) => (
                <span
                  key={value}
                  className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-foreground"
                >
                  {value}
                </span>
              ))}
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-background/40 p-4">
              <h2 className="mb-1 flex items-center gap-2 font-semibold text-primary">
                <Crown className="h-4 w-4" />
                寮の特徴
              </h2>
              <p className="text-sm text-muted-foreground">
                {house.animal}を象徴とし、{house.element || '神秘'}のイメージを持つ寮です。
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/40 p-4">
              <h2 className="mb-1 font-semibold text-primary">創設者・談話室</h2>
              <p className="text-sm text-muted-foreground">
                {house.founder} / {house.commonRoom}
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
