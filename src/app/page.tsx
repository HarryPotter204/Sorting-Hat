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
        <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-primary leading-tight text-center">
  {/* 「ホグワーツ」部分 */}
  <span className="block md:inline">ホグワーツ</span>

  {/* スマホだけ改行 */}
  <br className="block md:hidden" />

  {/* 「組分け診断！」部分 */}
  <span className="block md:inline">
    組分け診断
    {/* 「！」を少し下にずらして中心揃え */}
    <span className="relative top-1">！</span>
  </span>
</h1>

        <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto">
          組分け帽子の質問に答えて、ホグワーツの世界であなたが所属する寮を見つけよう。
        </p>
        <Button asChild size="lg" className="button-burgundy text-lg px-8 py-6 shadow-lg hover:shadow-accent/50 transition-all duration-300 transform hover:scale-105">
          <Link href="/quiz">
            <Wand2 className="mr-2 h-6 w-6" />
            組分けの儀式を始めよう！
          </Link>
        </Button>
      </header>

      <section className="w-full max-w-5xl space-y-8">
        <h2 className="text-3xl font-headline text-primary/90">四つの寮</h2>
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
                  <strong className="text-[hsl(var(--house-secondary))]">価値観:</strong> {house.values.join(', ')}.
                </CardDescription>
                <p className="mt-2 text-xs text-muted-foreground">創設者: {house.founder}.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-full max-w-3xl">
         <Card className="enchanted-parchment-dark">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">あなたを待っているもの</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-left text-foreground/90">
            <p>自分を見つける旅に出よう。質問に答えることで、あなたの性格や選択、そして本質的な価値観が明らかになり、あなたがいるべき寮が見えてきます。</p>
            <ul className="list-disc list-inside space-y-1">
              <li>対話式で、魔法の世界に入り込む体験。</li>
              <li>寮ごとの物語を取り入れた、美しい診断結果。</li>
              <li>AIが導き出す、あなたの寮にまつわる魔法の豆知識。</li>
              <li>組分けの歩みを記録しよう（ログインした魔法使い専用、まもなく登場！）</li>
            </ul>
            <p>ホグワーツの魔法があなたを呼んでいる。応える覚悟はあるか？</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
