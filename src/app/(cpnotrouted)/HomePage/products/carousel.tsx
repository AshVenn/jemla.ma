import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { FeaturedProduct } from "@/lib/backend/models/models";
import connectMongoDb from "@/lib/backend/db/mongodb";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Ratings } from "@/components/ui/ratings";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import Image from "next/image";

export async function FeaturedProductsCarousel() {
  // Connect to MongoDB and fetch featured products
  await connectMongoDb();

  const featuredProducts = await FeaturedProduct.find({ isActive: true })
    .populate("productID sellerID") // Populate product and seller details
    .sort({ displayOrder: 1 }) // Optional: sort by display order
    .exec();

  return (
    <Carousel className="w-full max-w-4xl mx-auto">
      <CarouselContent className="-ml-1">
        {featuredProducts.map(({ productID: product, sellerID: seller }, index) => {
          // Get the average rating directly from the product object
          const averageRating = product.averageRating;

          return (
            <CarouselItem key={product._id} className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                <Card className="h-full flex flex-col">
                  <CardHeader className="flex justify-center">
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description.slice(0, 60)}...</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex items-center justify-center p-4">
                    <Image 
                      width={300} // Set desired width
                      height={300} // Set desired height
                      src={product.images[0]}
                      alt={product.name}
                      className="object-contain rounded"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Avatar className="w-10 h-10"> {/* Set size of avatar */}
                              <AvatarImage src={seller.avatarImage} alt={seller.username} />
                              <AvatarFallback>{seller.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>{seller.username}</span> {/* Show seller username */}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center">
                      {averageRating > 0 ? (
                        <Ratings rating={averageRating} />
                      ) : (
                        <span>Pas de notes</span>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-2" />
      <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2" />
    </Carousel>
  );
}
