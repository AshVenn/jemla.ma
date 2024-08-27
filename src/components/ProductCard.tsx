"use client";

import { Card, CardHeader, CardDescription, CardFooter, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

type ProductCardProps = {
  key:number,
  productID: string;
  name: string;
  description?: string;
  basePrice: number;
  images: string[];
  averageRating: number;
  numReviews: number;
  className?: string;
};

export default function ProductCard({
  key,
  productID,
  name,
  description,
  basePrice,
  images,
  averageRating,
  numReviews,
}: ProductCardProps) {
  return (
    <Card key={key} className="w-full shadow-md flex flex-col h-[450px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-semibold truncate">{name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {description?.slice(0, 40)}...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center p-4 h-[200px]">
        <Image
          width={200}
          height={200}
          src={images[0]} // Displaying the first image in the array
          alt={name}
          className="rounded"
        />
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 mt-auto">
        <Badge className="text-sm font-semibold">{basePrice} €</Badge>
        <div className="text-sm text-muted-foreground">
          Évaluations: {averageRating}/5 ({numReviews} avis)
        </div>
      </CardFooter>
    </Card>
  );
}
