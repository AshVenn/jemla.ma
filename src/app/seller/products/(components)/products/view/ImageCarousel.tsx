import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';

type ImageCarouselProps = {
  images: string[];
};

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative overflow-hidden w-full max-w-[10rem]">
      <div
        className="flex transition-transform duration-1000"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0"
            style={{ width: "100%", flexBasis: "100%" }}
          >
            <Card className="w-20 h-20 mx-auto">
              <CardContent className="flex items-center justify-center p-1">
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  width={80} // Set width to match your container's width
                  height={80} // Set height to match your container's height
                  className="object-cover w-full h-full rounded"
                />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
