"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HOGWARTS_HOUSES } from "@/lib/constants";
import { BarChartHorizontalBig, Users } from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 🧪 Mock data based on the defined HOGWARTS_HOUSES
const MOCK_STATS_DATA = Object.values(HOGWARTS_HOUSES).map((house) => ({
  name: house.name,
  count: Math.floor(Math.random() * 1000) + 200,
  fill: `hsl(var(${house.colors.primaryVar}))`,
}));

export default function AdminStatsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header */}
      <header className="mb-8">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/admin">&larr; Back to Admin Dashboard</Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary">Sorting Statistics</h1>
        <p className="text-muted-foreground">Observe the ebb and flow of house populations.</p>
      </header>

      {/* House Distribution Chart */}
      <Card className="enchanted-parchment-dark">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <BarChartHorizontalBig className="mr-2 h-5 w-5" />
            House Distribution
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Total students sorted into each house.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS_DATA} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
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
                  tickFormatter={(value) => value.substring(0, 10)}
                />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Overall Statistics */}
      <Card className="mt-8 enchanted-parchment-dark">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Overall Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-foreground">
          <p>
            Total Quizzes Taken:{" "}
            <span className="font-bold text-primary">
              {(MOCK_STATS_DATA.reduce((sum, item) => sum + item.count, 0) * 1.2).toFixed(0)}
            </span>
          </p>
          <p>
            Average Questions Answered: <span className="font-bold text-primary">20</span>
          </p>
          <p>
            Most Common Sorting Period: <span className="font-bold text-primary">Evening</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
