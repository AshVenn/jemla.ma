"use client";

import * as React from "react";
import { useQuery } from "react-query";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { useSession } from "next-auth/react";

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

// Function to fetch review data from the API
const fetchReviewData = async (sellerID: string | undefined) => {
  const res = await fetch(`/api/seller/analytics?sellerID=${sellerID}`);
  const data = await res.json();

  console.log("API Response Data:", data);  // Debugging output

  return data;
};
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

export default function SellerReviewsPieChart() {
  const { data: session, status } = useSession();
  const sellerID = session?.user?.id;

  // Ensure that useQuery is called unconditionally
  const { data, isLoading, error } = useQuery(
    ['reviewData', sellerID],
    () => fetchReviewData(sellerID),
    { enabled: !!sellerID } // The query won't run until sellerID is available
  );

  // Handle loading and error states before the component renders the main UI
  if (status === "loading" || isLoading) return <div>Chargement...</div>;
  if (status === "unauthenticated" || error) return <div>Erreur de chargement des données</div>;

  // If there's no data or totalReviewsByRating is missing, we avoid the render error
  const totalReviewsByRating = data?.totalReviewsByRating || {};
  console.log(totalReviewsByRating)

  // Mapping the API data to the format needed for the chart
  const chartData = [
    { rating: "5 Étoiles", reviews: totalReviewsByRating[5] || 0, fill: chartConfig["5 Étoiles"].color },
    { rating: "4 Étoiles", reviews: totalReviewsByRating[4] || 0, fill: chartConfig["4 Étoiles"].color },
    { rating: "3 Étoiles", reviews: totalReviewsByRating[3] || 0, fill: chartConfig["3 Étoiles"].color },
    { rating: "2 Étoiles", reviews: totalReviewsByRating[2] || 0, fill: chartConfig["2 Étoiles"].color },
    { rating: "1 Étoile", reviews: totalReviewsByRating[1] || 0, fill: chartConfig["1 Étoile"].color },
  ];

  const totalReviews = chartData.reduce((acc, curr) => acc + curr.reviews, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Graphique des Avis</CardTitle>
        <CardDescription>Distribution des Évaluations (Janvier - Juin 2024)</CardDescription>
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
          Avis en hausse de 5% ce mois-ci <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage du total des avis pour les 6 derniers mois
        </div>
      </CardFooter>
    </Card>
  );
}
