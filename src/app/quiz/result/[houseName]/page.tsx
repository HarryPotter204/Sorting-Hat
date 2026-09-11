"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { HOGWARTS_HOUSES, HOUSE_NAMES_ARRAY } from "@/lib/constants";
import type { HouseName } from "@/lib/types";
import { HouseCrestDisplay } from "@/components/results/HouseCrestDisplay";
import { HouseInfoCard } from "@/components/results/HouseInfoCard";
import { AIFactGenerator } from "@/components/results/AIFactGenerator";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Share2,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  FileDown,
  Megaphone,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuiz } from "@/context/QuizContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  getLatestQuizResult,
  getQuizResultById,
  getStoredQuizResults,
  getSavedNickname,
} from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

function normalizeScores(
  scores: Partial<Record<HouseName, number>>,
): Record<HouseName, number> {
  return {
    Gryffindor: scores.Gryffindor ?? 0,
    Hufflepuff: scores.Hufflepuff ?? 0,
    Ravenclaw: scores.Ravenclaw ?? 0,
    Slytherin: scores.Slytherin ?? 0,
  };
}

export default function HouseResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state: quizState, dispatch: quizDispatch } = useQuiz();
  const { toast } = useToast();

  const houseNameParam = params.houseName as string;
  const houseName =
    HOUSE_NAMES_ARRAY.find(
      (hn) => hn.toLowerCase() === houseNameParam?.toLowerCase(),
    ) || quizState.sortedHouse;

  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const [nickname, setNickname] = useState<string>(() => {
    if (quizState.nickname) return quizState.nickname;
    const saved = getSavedNickname();
    if (saved) return saved;
    const latest = getLatestQuizResult();
    if (latest?.nickname) return latest.nickname;
    return "";
  });

  const [displayScores, setDisplayScores] = useState<Record<HouseName, number>>(
    () => {
      const hasContextScores = Object.values(quizState.scores || {}).some(
        (s) => (s || 0) > 0,
      );
      if (hasContextScores) return normalizeScores(quizState.scores);
      return {
        Gryffindor: houseName === "Gryffindor" ? 14 : 4,
        Ravenclaw: houseName === "Ravenclaw" ? 14 : 4,
        Hufflepuff: houseName === "Hufflepuff" ? 14 : 4,
        Slytherin: houseName === "Slytherin" ? 14 : 4,
      };
    },
  );

  useEffect(() => {
    // Only redirect if houseName is completely invalid
    if (!houseName || !HOGWARTS_HOUSES[houseName]) {
      if (quizState.sortedHouse && HOGWARTS_HOUSES[quizState.sortedHouse]) {
        router.replace(`/quiz/result/${quizState.sortedHouse.toLowerCase()}`);
      } else {
        router.replace("/quiz");
      }
    }
  }, [houseName, quizState.sortedHouse, router]);

  // Restore scores and nickname on reload or when navigating from history
  useEffect(() => {
    if (!houseName) return;
    const searchId = searchParams.get("id");
    if (searchId) {
      const matched = getQuizResultById(searchId);
      if (matched?.scores) {
        setDisplayScores(normalizeScores(matched.scores));
      }
      if (matched?.nickname) {
        setNickname(matched.nickname);
      }
      return;
    }
    const hasContextScores = Object.values(quizState.scores || {}).some(
      (s) => (s || 0) > 0,
    );
    if (hasContextScores) {
      setDisplayScores(normalizeScores(quizState.scores));
      if (quizState.nickname) setNickname(quizState.nickname);
      return;
    }
    const latest = getLatestQuizResult();
    if (latest && latest.houseName.toLowerCase() === houseName.toLowerCase()) {
      if (latest.scores) {
        setDisplayScores(normalizeScores(latest.scores));
      }
      if (latest.nickname) setNickname(latest.nickname);
      return;
    }
    const history = getStoredQuizResults();
    const found = history.find(
      (h) => h.houseName.toLowerCase() === houseName.toLowerCase(),
    );
    if (found) {
      if (found.scores) {
        setDisplayScores(normalizeScores(found.scores));
      }
      if (found.nickname) setNickname(found.nickname);
    }
  }, [houseName, searchParams, quizState.scores, quizState.nickname]);

  if (!houseName || !HOGWARTS_HOUSES[houseName]) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <h1 className="text-3xl font-headline text-destructive mb-4">
          あなたの寮は見つかりませんでした。
        </h1>
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
    quizDispatch({ type: "RETAKE_QUIZ" });
    router.push("/quiz");
  };

  const handleShare = () => {
    const studentPrefix = nickname ? `【${nickname}】` : "";
    const shareTitle = `${studentPrefix}ホグワーツ組分け結果：${house.name}！`;
    const shareText = `${studentPrefix}ホグワーツ組分け診断の結果、私は【${house.name}】に選ばれました！✨\n「${house.values.join("・")}」の精神を胸に、ホグワーツでの生活が始まります。\n#ホグワーツ組分け診断 #HarryPotter`;

    if (navigator.share) {
      navigator
        .share({
          title: shareTitle,
          text: shareText,
          url: window.location.href,
        })
        .catch((e) => {
          if (e.name !== "AbortError") {
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

  const generateCertificateCanvas =
    async (): Promise<HTMLCanvasElement | null> => {
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 1414; // Standard A4 aspect ratio
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      // Background Gradient: Deep magical twilight & nocturnal navy
      const grad = ctx.createLinearGradient(0, 0, 1000, 1414);
      grad.addColorStop(0, "#090e23");
      grad.addColorStop(0.3, "#131b3e");
      grad.addColorStop(0.7, "#1b2349");
      grad.addColorStop(1, "#070b1c");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1000, 1414);

      // Subtle star glimmers
      ctx.fillStyle = "rgba(255, 215, 0, 0.28)";
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 137.5) % 940) + 30;
        const sy = ((i * 241.9) % 1350) + 30;
        const radius = (i % 3) + 1;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Outer double gold border
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 6;
      ctx.strokeRect(36, 36, 928, 1342);

      ctx.strokeStyle = "rgba(212, 175, 55, 0.45)";
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, 904, 1318);

      // Corner flourishes
      const drawCorner = (x: number, y: number, angle: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(50, 0);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 50);
        ctx.moveTo(14, 14);
        ctx.lineTo(34, 14);
        ctx.moveTo(14, 14);
        ctx.lineTo(14, 34);
        ctx.stroke();
        ctx.restore();
      };
      drawCorner(64, 64, 0);
      drawCorner(936, 64, Math.PI / 2);
      drawCorner(936, 1350, Math.PI);
      drawCorner(64, 1350, -Math.PI / 2);

      // Header text
      ctx.textAlign = "center";
      ctx.fillStyle = "#E5C158";
      ctx.font = "bold 22px serif";
      ctx.fillText("HOGWARTS SCHOOL of WITCHCRAFT and WIZARDRY", 500, 110);

      ctx.font = "bold 34px serif";
      ctx.fillStyle = "#FFD700";
      ctx.fillText("ホグワーツ魔法魔術学校 ・ 組分け公式認定証", 500, 158);

      // Golden Divider line
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(220, 185);
      ctx.lineTo(780, 185);
      ctx.stroke();

      // Student Name Box
      const studentName = nickname || "新入生";
      ctx.fillStyle = "rgba(212, 175, 55, 0.12)";
      ctx.fillRect(180, 205, 640, 52);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.5)";
      ctx.strokeRect(180, 205, 640, 52);

      ctx.font = "bold 24px serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`生徒氏名： ${studentName}  殿`, 500, 240);

      // Load and draw crest image
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = house.crest;
      });

      if (img.complete && img.naturalHeight !== 0) {
        ctx.drawImage(img, 365, 275, 270, 270);
      }

      // House Name in Japanese & English
      ctx.font = "bold 56px serif";
      ctx.fillStyle = "#FFD700";
      ctx.fillText(house.name, 500, 595);

      ctx.font = "bold 22px serif";
      ctx.fillStyle = "#F0E6D2";
      ctx.fillText(`【創設者：${house.founder}】`, 500, 638);

      // House attributes
      ctx.font = "18px serif";
      ctx.fillStyle = "#CBD5E1";
      ctx.fillText(
        `象徴動物: ${house.animal}  |  四大元素: ${house.element}  |  談話室: ${house.commonRoom}`,
        500,
        672,
      );

      // Values box
      ctx.fillStyle = "rgba(255, 215, 0, 0.1)";
      ctx.fillRect(120, 700, 760, 95);
      ctx.strokeStyle = "rgba(255, 215, 0, 0.35)";
      ctx.strokeRect(120, 700, 760, 95);

      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = "#FFD700";
      ctx.fillText("尊ばれる徳目", 500, 736);
      ctx.font = "20px sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(house.values.join("   ・   "), 500, 770);

      // House Quote
      ctx.font = "italic 19px serif";
      ctx.fillStyle = "#E2E8F0";
      const quoteLines = house.quote.split("\n");
      quoteLines.forEach((line, index) => {
        ctx.fillText(line, 500, 835 + index * 32);
      });

      // Affinity Score Summary
      if (totalScoreSum > 0) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillRect(120, 990, 760, 75);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
        ctx.strokeRect(120, 990, 760, 75);

        ctx.font = "15px sans-serif";
        ctx.fillStyle = "#CBD5E1";
        ctx.fillText("【寮親和度スコア分布】", 500, 1018);

        const affinityText = HOUSE_NAMES_ARRAY.map((hn) => {
          const sc = displayScores[hn] || 0;
          const pct = ((Math.max(0, sc) / totalScoreSum) * 100).toFixed(0);
          return `${HOGWARTS_HOUSES[hn].name}: ${pct}%`;
        }).join("   |   ");

        ctx.font = "bold 16px sans-serif";
        ctx.fillStyle = "#FFD700";
        ctx.fillText(affinityText, 500, 1048);
      }

      // Bottom Certification
      const today = new Date().toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      ctx.font = "17px serif";
      ctx.fillStyle = "#CBD5E1";
      ctx.fillText(`授与日: ${today}`, 500, 1140);

      // Official Hat Seal Stamp
      ctx.save();
      ctx.strokeStyle = "#D4AF37";
      ctx.fillStyle = "rgba(180, 20, 20, 0.3)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(500, 1220, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 16px serif";
      ctx.fillStyle = "#FFD700";
      ctx.fillText("★ 組分け帽子 ★", 500, 1215);
      ctx.font = "bold 15px serif";
      ctx.fillText("公式認可証", 500, 1235);
      ctx.restore();

      ctx.font = "13px sans-serif";
      ctx.fillStyle = "#94A3B8";
      ctx.fillText(
        "The Sorting Hat has spoken. Your magical journey at Hogwarts begins.",
        500,
        1315,
      );

      return canvas;
    };

  // PDF format download
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const canvas = await generateCertificateCanvas();
      if (!canvas) throw new Error("Canvas could not be rendered");

      const studentName = nickname || "新入生";
      const jsPdfModule = await import("jspdf");
      const JsPdfConstructor =
        jsPdfModule.jsPDF ||
        (jsPdfModule as unknown as { default: typeof jsPdfModule.jsPDF })
          .default;
      const pdf = new JsPdfConstructor({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297, undefined, "FAST");
      pdf.save(
        `hogwarts_certificate_${houseName.toLowerCase()}_${studentName}.pdf`,
      );

      toast({
        title: "装飾PDF認定証をダウンロードしました！",
        description: `【${house.name}】の公式組分け認定証（PDF）が保存されました。`,
      });
    } catch (e) {
      console.error("PDF download error", e);
      toast({
        title: "PDF生成中にエラーが発生しました",
        description: "もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // PNG image format download
  const handleDownloadCard = async () => {
    setIsDownloading(true);
    try {
      const canvas = await generateCertificateCanvas();
      if (!canvas) throw new Error("Canvas could not be rendered");

      const studentName = nickname || "新入生";
      const link = document.createElement("a");
      link.download = `hogwarts-sorting-${houseName.toLowerCase()}-${studentName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "認定証画像を保存しました！",
        description: `【${house.name}】の組分け認定証（画像）が保存されました。`,
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

  const totalScoreSum = Object.values(displayScores).reduce(
    (sum, score = 0) => sum + Math.max(0, score),
    0,
  );

  // 組み分け理由を計算する（最終寮への寄与が大きい回答から最大3件）
  const getSortingReasons = (): string[] => {
    const answers = quizState.answers;
    const questions = quizState.questionsList;
    if (!answers || Object.keys(answers).length === 0) return [];

    const contributions: { reason: string; score: number }[] = [];
    questions.forEach((q) => {
      const optionId = answers[q.id];
      if (!optionId) return;
      const option = q.options.find((opt) => opt.id === optionId);
      if (!option) return;
      const contribution = option.houseAffinity[houseName] || 0;
      if (contribution > 0) {
        const reason =
          option.reason ||
          `${option.text}を選んだあなたは、${HOGWARTS_HOUSES[houseName].name}らしさが表れています。`;
        contributions.push({ reason, score: contribution });
      }
    });

    contributions.sort((a, b) => b.score - a.score);
    return contributions.slice(0, 3).map((c) => c.reason);
  };

  const sortingReasons = getSortingReasons();

  return (
    <div
      className={cn(
        "flex flex-col items-center space-y-8 py-10 min-h-[calc(100vh-200px)] animate-fade-in-up",
        `theme-${house.name.toLowerCase()}`,
      )}
    >
      <header className="text-center space-y-3 px-3">
        {nickname ? (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/15 border border-primary/40 text-primary text-xs sm:text-sm font-semibold mb-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>【{nickname}】殿の組分け結果</span>
          </div>
        ) : null}
        <p className="font-display text-[10px] sm:text-xs tracking-[0.4em] text-primary/80 uppercase">
          The Sorting Result
        </p>
        <div className="ornament-rule" aria-hidden="true">
          <span className="text-[10px]">✦</span>
        </div>
        <p className="text-sm sm:text-base font-medium text-foreground/80">
          組み分け帽子が、その声を高らかに響かせた――
        </p>
        <h1 className="whitespace-nowrap text-[clamp(1.25rem,7vw,3.75rem)] font-headline font-bold leading-tight text-[hsl(var(--house-primary))] drop-shadow-[0_0_18px_hsl(var(--house-primary)_/_0.35)]">
          ようこそ {house.name} へ!
        </h1>
      </header>

      {sortingReasons.length > 0 && (
        <div className="w-full max-w-lg px-4 pt-3">
          {/* The Sorting Hat's words - an old book page */}
          <div className="parchment rounded-lg p-5 relative">
            <span className="wax-seal absolute -top-3 -right-2" aria-hidden="true">
              <span className="text-[10px]">帽</span>
            </span>
            <p className="text-sm font-bold text-[#43371f] font-headline mb-2.5 text-center tracking-wide">
              ― 組み分け帽子からの言葉 ―
            </p>
            <div className="ornament-rule mb-3 opacity-70" aria-hidden="true">
              <span className="text-[9px]">✦</span>
            </div>
            <ul className="space-y-2.5">
              {sortingReasons.map((reason, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-[#43371f] leading-relaxed"
                >
                  <Sparkles className="h-4 w-4 text-[#8a6d2f] shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <HouseCrestDisplay house={house} size={250} />

      <div className="grid w-full max-w-4xl grid-cols-1 justify-items-center gap-8 px-4 md:grid-cols-2">
        <HouseInfoCard house={house} />
        <AIFactGenerator houseName={houseName} />
      </div>

      {/* Shareable Certificate Card & Actions */}
      <Card
        className={cn(
          "w-full max-w-lg enchanted-parchment-dark",
          `theme-${house.name.toLowerCase()}`,
        )}
      >
        <CardHeader>
          <CardTitle className="font-headline text-xl text-[hsl(var(--house-primary))] flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            組分けの公式認定証
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-base sm:text-lg text-foreground">
            {nickname ? `祝福を、${nickname} 殿！` : "祝福を！"} あなたはまさに{" "}
            <strong className="text-[hsl(var(--house-secondary))]">
              {house.name}
            </strong>{" "}
            の精神を受け継ぐ者です。
          </p>

          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-xs text-foreground/90 flex items-center justify-center gap-2">
            <Megaphone className="h-4 w-4 text-yellow-400 shrink-0" />
            <span>
              あなたの組分け結果は、大広間の【魔法掲示板】にも速報として掲示されました！
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-2.5 pt-2">
            <Button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="button-gold shadow-md font-semibold text-xs sm:text-sm h-10 px-4"
            >
              <FileDown className="mr-2 h-4 w-4 text-yellow-400" />
              {isDownloadingPdf
                ? "PDF生成中..."
                : "装飾PDF認定証をダウンロード"}
            </Button>

            <Button
              onClick={handleDownloadCard}
              disabled={isDownloading}
              variant="outline"
              className="border-[hsl(var(--house-primary))] text-[hsl(var(--house-primary))] hover:bg-[hsl(var(--house-primary)_/_0.1)] text-xs sm:text-sm h-10"
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? "生成中..." : "画像(PNG)保存"}
            </Button>

            <Button
              onClick={handleShare}
              variant="outline"
              className="border-[hsl(var(--house-primary))] text-[hsl(var(--house-primary))] hover:bg-[hsl(var(--house-primary)_/_0.1)] text-xs sm:text-sm h-10"
            >
              <Share2 className="mr-2 h-4 w-4" /> 共有
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Score Distribution */}
      {totalScoreSum > 0 && (
        <Card className="w-full max-w-md enchanted-parchment-dark">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">
              あなたの寮との親和スコア
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {HOUSE_NAMES_ARRAY.map((hn) => {
              const score = displayScores[hn] || 0;
              const percentage =
                totalScoreSum > 0
                  ? (Math.max(0, score) / totalScoreSum) * 100
                  : 0;
              return (
                <div
                  key={hn}
                  className={cn("py-1", `theme-${hn.toLowerCase()}`)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[hsl(var(--house-primary))]">
                      {hn}
                    </span>
                    <span className="text-xs text-[hsl(var(--house-secondary))]">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className={cn(
                      "h-2 [&>div]:bg-[hsl(var(--house-primary))]",
                      hn === house.name
                        ? "bg-[hsl(var(--house-primary)_/_0.3)]"
                        : "bg-muted/30",
                    )}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex w-full max-w-md gap-3 px-4 sm:gap-4 sm:px-0">
        <Button
          onClick={handleRetakeQuiz}
          size="lg"
          className="button-burgundy min-w-0 flex-1 justify-center whitespace-nowrap px-2 text-[clamp(0.65rem,2.5vw,1rem)]"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          クイズをもう一度受ける
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="min-w-0 flex-1 justify-center whitespace-nowrap border-primary px-2 text-[clamp(0.65rem,2.5vw,1rem)] text-primary hover:bg-primary/10"
        >
          <Link href="/history">組分け記録を見る</Link>
        </Button>
      </div>

      {/* Mini Game - A quiet invitation after the sorting (external site) */}
      <section className="w-full max-w-md px-4">
        <a
          href="https://harrypotter307-game.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="魔法のミニゲーム（外部サイト・新しいタブで開きます）"
          className="group block rounded-xl border border-primary/25 bg-[hsl(var(--card)/0.75)] backdrop-blur-[4px] p-3.5 sm:p-4 text-left shadow-[0_6px_18px_hsl(230_45%_3%/0.5)] transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_hsl(43_60%_60%/0.14),0_6px_18px_hsl(230_45%_3%/0.5)]"
        >
          <div className="flex items-center gap-3">
            {/* Gilded game emblem with a soft glow on hover */}
            <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full border border-primary/35 bg-primary/10 text-primary transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_10px_hsl(var(--primary)/0.4)]">
              <Gamepad2 className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="font-headline text-sm sm:text-base font-bold text-primary tracking-wide">
                  魔法のミニゲーム
                </h2>
                <ExternalLink
                  className="h-3 w-3 shrink-0 text-primary/50"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-0.5 text-xs text-foreground/75 leading-relaxed">
                結果を見たあとは、魔法の世界でひと休み。
              </p>
              <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-primary/90 transition-colors group-hover:text-primary">
                ゲームで遊ぶ
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </p>
            </div>
          </div>
        </a>
      </section>

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
                あなたは{" "}
                <strong className="text-primary text-lg">{house.name}</strong>{" "}
                に選ばれました！
              </p>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">
                  共有用リンク
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={
                      typeof window !== "undefined" ? window.location.href : ""
                    }
                    className="flex-1 px-3 py-2 text-sm border border-input rounded bg-background text-foreground select-all"
                  />
                  <Button
                    onClick={copyShareLink}
                    size="sm"
                    className="button-gold whitespace-nowrap"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copied ? "完了!" : "コピー"}
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex flex-col gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`ホグワーツ組分け診断の結果、私は【${house.name}】に選ばれました！✨\n#ホグワーツ組分け診断`)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-500 font-medium text-sm transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" /> X (旧Twitter)
                  でシェア
                </a>

                <a
                  href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-500 font-medium text-sm transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" /> LINE で送る
                </a>
              </div>

              <Button
                onClick={() => setShowShareModal(false)}
                variant="ghost"
                className="w-full mt-2 text-muted-foreground hover:text-foreground"
              >
                閉じる
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
