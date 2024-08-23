"use client";

import { useQuery } from "react-query";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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

// Function to fetch products data from the API
const fetchProductsData = async (sellerID: string | undefined) => {
  const res = await fetch(`/api/seller/analytics?sellerID=${sellerID}`);
  return res.json();
};

const chartConfig = {
  products: {
    label: "Produits",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function SellerProductsLineChart() {
  const { data: session, status } = useSession();
  const sellerID = session?.user?.id;

  const { data, isLoading, error } = useQuery(
    ['productsData', sellerID],
    () => fetchProductsData(sellerID),
    { enabled: !!sellerID } // Only run the query if sellerID is available
  );

  if (status === "loading" || isLoading) return <div>Chargement...</div>;
  if (status === "unauthenticated" || error) return <div>Erreur de chargement des données</div>;

  const chartData = Array(6).fill(0).map((_, idx) => ({
    month: new Date(2024, idx).toLocaleDateString('fr-FR', { month: 'long' }),
    products: data.totalProducts, // Adjust if you have specific data per month
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
