"use client";

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { HOGWARTS_HOUSES, HOUSE_NAMES_ARRAY } from '@/lib/constants';
import type { HouseName } from '@/lib/types';
import { HouseCrestDisplay } from '@/components/results/HouseCrestDisplay';
import { HouseInfoCard } from '@/components/results/HouseInfoCard';
import { AIFactGenerator } from '@/components/results/AIFactGenerator';
import { Button } from '@/components/ui/button';
import { RotateCcw, Share2, Download, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { saveQuizResult, getLatestQuizResult, getQuizResultById, getStoredQuizResults } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function HouseResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state: quizState, dispatch: quizDispatch } = useQuiz();
  const { toast } = useToast();

  const houseNameParam = params.houseName as string;
  const houseName = HOUSE_NAMES_ARRAY.find(hn => hn.toLowerCase() === houseNameParam?.toLowerCase()) || quizState.sortedHouse;
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const savedRef = useRef(false);

  const [nickname, setNickname] = useState<string>(() => {
    if (quizState.nickname) return quizState.nickname;
    const latest = getLatestQuizResult();
    if (latest?.nickname) return latest.nickname;
    return '';
  });

  const [displayScores, setDisplayScores] = useState<Record<HouseName, number>>(() => {
    const hasContextScores = Object.values(quizState.scores || {}).some(s => (s || 0) > 0);
    if (hasContextScores) return quizState.scores;
    return {
      Gryffindor: houseName === 'Gryffindor' ? 14 : 4,
      Ravenclaw: houseName === 'Ravenclaw' ? 14 : 4,
      Hufflepuff: houseName === 'Hufflepuff' ? 14 : 4,
      Slytherin: houseName === 'Slytherin' ? 14 : 4,
    };
  });

  useEffect(() => {
    // Only redirect if houseName is completely invalid
    if (!houseName || !HOGWARTS_HOUSES[houseName]) {
      if (quizState.sortedHouse && HOGWARTS_HOUSES[quizState.sortedHouse]) {
        router.replace(`/quiz/result/${quizState.sortedHouse.toLowerCase()}`);
      } else {
        router.replace('/quiz');
      }
    }
  }, [houseName, quizState.sortedHouse, router]);

  // Restore scores and nickname on reload or when navigating from history
  useEffect(() => {
    if (!houseName) return;
    const searchId = searchParams.get('id');
    if (searchId) {
      const matched = getQuizResultById(searchId);
      if (matched?.scores) {
        setDisplayScores(matched.scores);
      }
      if (matched?.nickname) {
        setNickname(matched.nickname);
      }
      return;
    }
    const hasContextScores = Object.values(quizState.scores || {}).some(s => (s || 0) > 0);
    if (hasContextScores) {
      setDisplayScores(quizState.scores);
      if (quizState.nickname) setNickname(quizState.nickname);
      return;
    }
    const latest = getLatestQuizResult();
    if (latest && latest.houseName.toLowerCase() === houseName.toLowerCase()) {
      if (latest.scores) setDisplayScores(latest.scores);
      if (latest.nickname) setNickname(latest.nickname);
      return;
    }
    const history = getStoredQuizResults();
    const found = history.find(h => h.houseName.toLowerCase() === houseName.toLowerCase());
    if (found) {
      if (found.scores) setDisplayScores(found.scores);
      if (found.nickname) setNickname(found.nickname);
    }
  }, [houseName, searchParams, quizState.scores, quizState.nickname]);

  // Automatically save to history on mount if completed in this session
  useEffect(() => {
    if (quizState.isCompleted && houseName && HOGWARTS_HOUSES[houseName] && !savedRef.current) {
      savedRef.current = true;
      saveQuizResult({
        userId: 'student_' + Math.random().toString(36).substring(2, 6),
        nickname: nickname || quizState.nickname || '新入生',
        houseName: houseName,
        scores: displayScores,
      });
    }
  }, [quizState.isCompleted, houseName, displayScores, nickname, quizState.nickname]);


  if (!houseName || !HOGWARTS_HOUSES[houseName]) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <h1 className="text-3xl font-headline text-destructive mb-4">あなたの寮は見つかりませんでした。</h1>
        <p className="text-lg text-muted-foreground mb-6">
          組み分け帽子は首をかしげています。もう一度やり直しましょう。
        </p>
        <Button asChild className="button-gold">
          <Link href="/quiz">クイズを受け直す</Link>
        </Button>
      </div>
    );
  }

  const house = HOGWARTS_HOUSES[houseName];

  const handleRetakeQuiz = () => {
    quizDispatch({ type: 'RETAKE_QUIZ' });
    router.push('/quiz');
  };

  const handleShare = () => {
    const studentPrefix = nickname ? `【${nickname}】` : '';
    const shareTitle = `${studentPrefix}ホグワーツ組分け結果：${house.name}！`;
    const shareText = `${studentPrefix}ホグワーツ組分け診断の結果、私は【${house.name}】に選ばれました！✨\n「${house.values.join('・')}」の精神を胸に、ホグワーツでの生活が始まります。\n#ホグワーツ組分け診断 #HarryPotter`;
    
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: window.location.href,
      }).catch((e) => {
        if (e.name !== 'AbortError') {
          setShowShareModal(true);
        }
      });
    } else {
      setShowShareModal(true);
    }
  };


  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: "リンクをコピーしました！",
        description: "友達にシェアして結果を比べよう！",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({
        title: "コピーに失敗しました",
        description: "ブラウザのURLを直接コピーしてください。",
        variant: "destructive",
      });
    }
  };
  
  const handleDownloadCard = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1250;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      const grad = ctx.createLinearGradient(0, 0, 1000, 1250);
      grad.addColorStop(0, '#121838');
      grad.addColorStop(0.5, '#1A237E');
      grad.addColorStop(1, '#0c102a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1000, 1250);

      // Gold ornate border
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, 940, 1190);

      ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(45, 45, 910, 1160);

      // Corner ornaments
      const drawCorner = (x: number, y: number, angle: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(40, 0);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 40);
        ctx.stroke();
        ctx.restore();
      };
      drawCorner(60, 60, 0);
      drawCorner(940, 60, Math.PI / 2);
      drawCorner(940, 1190, Math.PI);
      drawCorner(60, 1190, -Math.PI / 2);

      // Header text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 32px serif';
      ctx.fillText('HOGWARTS SCHOOL of WITCHCRAFT and WIZARDRY', 500, 120);

      ctx.font = '24px serif';
      ctx.fillStyle = '#E6E6FA';
      ctx.fillText('ホグワーツ魔法魔術学校 ・ 組分け認定証', 500, 165);

      // Divider line
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(250, 185);
      ctx.lineTo(750, 185);
      ctx.stroke();

      // Student Name on certificate
      const studentName = nickname || '新入生';
      ctx.font = 'bold 24px serif';
      ctx.fillStyle = '#f5d77f';
      ctx.fillText(`生徒氏名: ${studentName} 殿`, 500, 218);

      // Load and draw crest image
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // continue even if image fails
        img.src = house.crest;
      });

      if (img.complete && img.naturalHeight !== 0) {
        ctx.drawImage(img, 360, 240, 280, 280);
      }

      // House Name
      ctx.font = 'bold 64px serif';
      ctx.fillStyle = '#FFD700';
      ctx.fillText(house.name, 500, 580);


      ctx.font = '24px serif';
      ctx.fillStyle = '#dcdcdc';
      ctx.fillText(`【創設者：${house.founder}】`, 500, 630);

      // Values box
      ctx.fillStyle = 'rgba(255, 215, 0, 0.08)';
      ctx.fillRect(150, 670, 700, 110);
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.strokeRect(150, 670, 700, 110);

      ctx.font = 'bold 28px sans-serif';
      ctx.fillStyle = '#FFD700';
      ctx.fillText('尊ばれる徳目', 500, 715);
      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(house.values.join('  ・  '), 500, 755);

      // House Quote
      ctx.font = 'italic 20px serif';
      ctx.fillStyle = '#e0e0e0';
      const quoteLines = house.quote.split('\n');
      quoteLines.forEach((line, index) => {
        ctx.fillText(line, 500, 830 + index * 32);
      });

      // Bottom Certification
      const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.font = '18px serif';
      ctx.fillStyle = '#b0b8d0';
      ctx.fillText(`授与日: ${today}`, 500, 1020);

      ctx.font = 'bold 24px serif';
      ctx.fillStyle = '#FFD700';
      ctx.fillText('組分け帽子 認可済', 500, 1065);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#8a94b8';
      ctx.fillText('The Sorting Hat has spoken. Your journey at Hogwarts begins.', 500, 1110);

      // Download
      const link = document.createElement('a');
      link.download = `hogwarts-sorting-${houseName.toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "認定証をダウンロードしました！",
        description: `【${house.name}】の組分け証が画像として保存されました。`,
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "ダウンロード中にエラーが発生しました",
        description: "もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const totalScoreSum = Object.values(displayScores).reduce((sum, score = 0) => sum + Math.max(0, score), 0);

  return (
    <div className={cn("flex flex-col items-center space-y-8 py-10 min-h-[calc(100vh-200px)] animate-fade-in-up", `theme-${house.name.toLowerCase()}`)}>
      <header className="text-center space-y-2 px-3">
        {nickname ? (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs sm:text-sm font-semibold mb-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>【{nickname}】殿の組分け結果</span>
          </div>
        ) : null}
        <p className="text-base sm:text-lg font-medium text-foreground/80">組み分け帽子の声が響き渡る！</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-[hsl(var(--house-primary))]">
          ようこそ {house.name} へ!
        </h1>
      </header>

      <HouseCrestDisplay house={house} size={250} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        <HouseInfoCard house={house} />
        <AIFactGenerator houseName={house.name} />
      </div>

      {/* Shareable Card & Actions */}
      <Card className={cn("w-full max-w-md enchanted-parchment-dark", `theme-${house.name.toLowerCase()}`)}>
        <CardHeader>
          <CardTitle className="font-headline text-xl text-[hsl(var(--house-primary))] flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            組分けの証明
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-base sm:text-lg text-foreground">
            {nickname ? `祝福を、${nickname} 殿！` : '祝福を！'} あなたはまさに <strong className="text-[hsl(var(--house-secondary))]">{house.name}</strong> の精神を受け継ぐ者です。
          </p>

          <div className="flex justify-center space-x-3">
            <Button onClick={handleShare} variant="outline" className="border-[hsl(var(--house-primary))] text-[hsl(var(--house-primary))] hover:bg-[hsl(var(--house-primary)_/_0.1)]">
              <Share2 className="mr-2 h-4 w-4" /> 共有
            </Button>
            <Button 
              onClick={handleDownloadCard} 
              disabled={isDownloading} 
              variant="outline" 
              className="border-[hsl(var(--house-primary))] text-[hsl(var(--house-primary))] hover:bg-[hsl(var(--house-primary)_/_0.1)]"
            >
              <Download className="mr-2 h-4 w-4" /> {isDownloading ? '生成中...' : '認定証を保存'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Score Distribution */}
      {totalScoreSum > 0 && (
        <Card className="w-full max-w-md enchanted-parchment-dark">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">あなたの寮との親和スコア</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {HOUSE_NAMES_ARRAY.map(hn => {
              const score = displayScores[hn] || 0;
              const percentage = totalScoreSum > 0 ? (Math.max(0, score) / totalScoreSum) * 100 : 0;
              return (
                <div key={hn} className={cn("py-1", `theme-${hn.toLowerCase()}`)}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[hsl(var(--house-primary))]">{hn}</span>
                    <span className="text-xs text-[hsl(var(--house-secondary))]">{percentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={percentage} className={cn("h-2 [&>div]:bg-[hsl(var(--house-primary))]", hn === house.name ? "bg-[hsl(var(--house-primary)_/_0.3)]" : "bg-muted/30")} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}


      <div className="mt-8 flex gap-4">
        <Button onClick={handleRetakeQuiz} size="lg" className="button-burgundy">
          <RotateCcw className="mr-2 h-5 w-5" />
          クイズをもう一度受ける
        </Button>
        <Button asChild size="lg" variant="outline" className="text-primary border-primary hover:bg-primary/10">
          <Link href="/history">
            組分け記録を見る
          </Link>
        </Button>
      </div>

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-popover border-border p-6 rounded-xl shadow-2xl max-w-md w-full animate-fade-in-up">
            <CardHeader className="pb-3 text-center">
              <CardTitle className="font-headline text-2xl text-primary flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5" />
                結果を共有しよう！
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-foreground">
                あなたは <strong className="text-primary text-lg">{house.name}</strong> に選ばれました！
              </p>
              
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">共有用リンク</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? window.location.href : ''}
                    className="flex-1 px-3 py-2 text-sm border border-input rounded bg-background text-foreground select-all"
                  />
                  <Button onClick={copyShareLink} size="sm" className="button-gold whitespace-nowrap">
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? '完了!' : 'コピー'}
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex flex-col gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`ホグワーツ組分け診断の結果、私は【${house.name}】に選ばれました！✨\n#ホグワーツ組分け診断`)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-500 font-medium text-sm transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" /> X (旧Twitter) でシェア
                </a>

                <a
                  href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-500 font-medium text-sm transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" /> LINE で送る
                </a>
              </div>

              <Button onClick={() => setShowShareModal(false)} variant="ghost" className="w-full mt-2 text-muted-foreground hover:text-foreground">
                閉じる
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

