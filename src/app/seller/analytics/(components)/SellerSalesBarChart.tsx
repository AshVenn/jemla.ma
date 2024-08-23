"use client";

import { useQuery } from "react-query";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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

// Function to fetch sales data from the API
const fetchSalesData = async (sellerID: string | undefined) => {
  const res = await fetch(`/api/seller/analytics?sellerID=${sellerID}`);
  return res.json();
};

const chartConfig = {
  sales: {
    label: "Ventes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function SellerSalesBarChart() {
  const { data: session, status } = useSession();
  const sellerID = session?.user?.id;

  const { data, isLoading, error } = useQuery(
    ['salesData', sellerID],
    () => fetchSalesData(sellerID),
    { enabled: !!sellerID } // Only run the query if sellerID is available
  );

  if (status === "loading" || isLoading) return <div>Chargement...</div>;
  if (status === "unauthenticated" || error) return <div>Erreur de chargement des données</div>;

  const chartData = data.totalSales.map((sale: any) => ({
    month: new Date(sale._id.year, sale._id.month - 1).toLocaleDateString('fr-FR', { month: 'long' }),
    sales: sale.totalAmount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Graphique des Ventes</CardTitle>
        <CardDescription>Ventes par Mois</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Ventes en hausse ce mois-ci <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage du total des ventes par mois
        </div>
      </CardFooter>
    </Card>
  );
}
