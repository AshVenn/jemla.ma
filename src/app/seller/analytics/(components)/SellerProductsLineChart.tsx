import React from "react";
import { Line, LineChart, CartesianGrid, XAxis } from "recharts";
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
  products: {
    label: "Produits",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type SellerProductsLineChartProps = {
  productsData: number;
};

export default function SellerProductsLineChart({ productsData }: SellerProductsLineChartProps) {
  const chartData = Array(6).fill(0).map((_, idx) => ({
    month: new Date(2024, idx).toLocaleDateString('fr-FR', { month: 'long' }),
    products: productsData,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Graphique des Produits</CardTitle>
        <CardDescription>Nombre total de produits</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="products"
              type="natural"
              stroke={chartConfig.products.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Nombre de produits en augmentation <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage du total des produits disponibles
        </div>
      </CardFooter>
    </Card>
  );
}
