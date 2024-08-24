"use client";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
  sales: {
    label: "Ventes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type SellerSalesBarChartProps = {
  salesData: Array<any>;
  currentMonthSales: number;
  previousMonthSales: number;
};

export default function SellerSalesBarChart({ salesData = [], currentMonthSales, previousMonthSales }: SellerSalesBarChartProps) {
  // Ensure salesData is in the correct format
  const chartData = salesData.map((sale: any) => ({
    month: new Date(sale._id.year, sale._id.month - 1).toLocaleDateString('fr-FR', { month: 'long' }),
    sales: sale.totalAmount || 0,
  }));

  // Calculate percentage increase
  const percentageIncrease = previousMonthSales
    ? ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Graphique des Ventes</CardTitle>
        <CardDescription>Ventes par Mois</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="sales" fill={chartConfig.sales.color} radius={8} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div>Pas de données disponibles pour les ventes</div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {percentageIncrease >= 0
            ? `Ventes en hausse de ${percentageIncrease.toFixed(2)}% ce mois-ci`
            : `Ventes en baisse de ${Math.abs(percentageIncrease).toFixed(2)}% ce mois-ci`}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage du total des ventes par mois
        </div>
      </CardFooter>
    </Card>
  );
}
