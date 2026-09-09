"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HOGWARTS_HOUSES, HOUSE_NAMES_ARRAY } from "@/lib/constants";
import { BarChartHorizontalBig, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { getStoredQuizResults } from "@/lib/storage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const HOUSE_COLORS: Record<string, string> = {
  Gryffindor: "#740001",
  Ravenclaw: "#0e1a40",
  Hufflepuff: "#ecb939",
  Slytherin: "#1a472a",
};

export default function AdminStatsPage() {
  const [statsData, setStatsData] = useState<
    { name: string; count: number; fill: string }[]
  >([]);
  const [userResultCount, setUserResultCount] = useState(0);

  useEffect(() => {
    const userResults = getStoredQuizResults();
    setUserResultCount(userResults.length);

    void fetch("/api/house-stats", { cache: "no-store" })
      .then((response) => {
        if (!response.ok)
          throw new Error(`House stats request failed: ${response.status}`);
        return response.json();
      })
      .then((counts: Record<string, number>) => {
        setStatsData(
          HOUSE_NAMES_ARRAY.map((houseName) => ({
            name: houseName,
            count:
              typeof counts[houseName] === "number" ? counts[houseName] : 0,
            fill: HOUSE_COLORS[houseName] || "#FFD700",
          })),
        );
      })
      .catch((error) => {
        console.error("Failed to load house stats", error);
        setStatsData([]);
      });
  }, []);

  const totalCount = statsData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-in-up">
      {/* Header */}
      <header className="mb-8">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/admin">&larr; 管理ダッシュボードに戻る</Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary">
          組分け統計・分析
        </h1>
        <p className="text-muted-foreground">
          ホグワーツ各寮に配属された生徒の総数と分布状況を可視化します。
        </p>
      </header>

      {/* House Distribution Chart */}
      <Card className="enchanted-parchment-dark">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <BarChartHorizontalBig className="mr-2 h-5 w-5" />
            寮ごとの所属生徒数
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            ベース母数と実受検者の集計に基づく分布グラフです。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statsData}
                layout="vertical"
                margin={{ left: 20, right: 30, top: 10, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.1)"
                />
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1c2242",
                    border: "1px solid #FFD700",
                    borderRadius: "8px",
                    color: "#FFF",
                  }}
                  formatter={(value: number) => [
                    `${value.toLocaleString()} 名`,
                    "生徒数",
                  ]}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {statsData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="enchanted-parchment-dark">
          <CardHeader className="pb-2">
            <CardTitle className="font-headline text-base text-primary flex items-center">
              <Users className="mr-2 h-4 w-4" />
              総生徒数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-headline text-primary">
              {totalCount.toLocaleString()}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                名
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              4寮に所属する全生徒
            </p>
          </CardContent>
        </Card>

        <Card className="enchanted-parchment-dark">
          <CardHeader className="pb-2">
            <CardTitle className="font-headline text-base text-primary flex items-center">
              <Sparkles className="mr-2 h-4 w-4" />
              この端末での診断回数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-headline text-yellow-400">
              {userResultCount}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                回
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              履歴ページに保存された受検数
            </p>
          </CardContent>
        </Card>

        <Card className="enchanted-parchment-dark">
          <CardHeader className="pb-2">
            <CardTitle className="font-headline text-base text-primary flex items-center">
              <BarChartHorizontalBig className="mr-2 h-4 w-4" />
              最多選出寮
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-headline text-primary">
              {statsData.length > 0
                ? [...statsData].sort((a, b) => b.count - a.count)[0]?.name
                : "未定"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              現在トップを走る寮
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
