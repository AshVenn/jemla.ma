import React from "react";
import { Pie, PieChart, Label } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  reviews: {
    label: "Avis",
  },
  "5 Étoiles": {
    label: "5 Étoiles",
    color: "hsl(var(--chart-3))",
  },
  "4 Étoiles": {
    label: "4 Étoiles",
    color: "hsl(var(--chart-4))",
  },
  "3 Étoiles": {
    label: "3 Étoiles",
    color: "hsl(var(--chart-5))",
  },
  "2 Étoiles": {
    label: "2 Étoiles",
    color: "hsl(var(--chart-6))",
  },
  "1 Étoile": {
    label: "1 Étoile",
    color: "hsl(var(--chart-7))",
  },
} satisfies ChartConfig;

type SellerReviewsPieChartProps = {
  reviewData: Record<string, number>;
  previousTotalReviews: number; // Previous total reviews
};

export default function SellerReviewsPieChart({ reviewData, previousTotalReviews }: SellerReviewsPieChartProps) {
  const chartData = [
    { rating: "5 Étoiles", reviews: reviewData[5] || 0, fill: chartConfig["5 Étoiles"].color },
    { rating: "4 Étoiles", reviews: reviewData[4] || 0, fill: chartConfig["4 Étoiles"].color },
    { rating: "3 Étoiles", reviews: reviewData[3] || 0, fill: chartConfig["3 Étoiles"].color },
    { rating: "2 Étoiles", reviews: reviewData[2] || 0, fill: chartConfig["2 Étoiles"].color },
    { rating: "1 Étoile", reviews: reviewData[1] || 0, fill: chartConfig["1 Étoile"].color },
  ];

  const totalReviews = chartData.reduce((acc, curr) => acc + curr.reviews, 0);

  const percentageIncrease = previousTotalReviews
    ? ((totalReviews - previousTotalReviews) / previousTotalReviews) * 100
    : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Graphique des Avis</CardTitle>
        <CardDescription>Distribution des Évaluations pour l'année en cours</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="reviews"
              nameKey="rating"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalReviews.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Avis
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {percentageIncrease >= 0
            ? `Avis en hausse de ${percentageIncrease.toFixed(2)}% ce mois-ci`
            : `Avis en baisse de ${Math.abs(percentageIncrease).toFixed(2)}% ce mois-ci`}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
           Affichage des avis pour le mois en cours
        </div>
      </CardFooter>
    </Card>
  );
}
