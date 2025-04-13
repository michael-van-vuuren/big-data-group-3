"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';
import WelcomeButton from '@/components/welcome-button'; // Assuming this takes a 'message' prop

// Import images
import fruitySystem from '@/images/fruity.png';
import herbalSystem from '@/images/herbal.png';
import savorySystem from '@/images/savory.png';
import warmSystem from '@/images/warm.png';
import sweetSystem from '@/images/sweet.png';

const systems = [
  { name: 'Fruity System', image: fruitySystem, link: '/flavors/Fruity' },
  { name: 'Herbal System', image: herbalSystem, link: '/flavors/Herbal' },
  { name: 'Sweet System', image: sweetSystem, link: '/flavors/Sweet' },
  { name: 'Savory System', image: savorySystem, link: '/flavors/Savory' },
  { name: 'Warm System', image: warmSystem, link: '/flavors/Warm' },
];

export default function Header() {
  const { user, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const buttonMessage = user ? "Take Preference Quiz" : "Log In";
  const buttonLink = user ? "/quiz" : "/login";

  if (isLoading) return null;

  const gradientOverlay = `radial-gradient(ellipse 100% 80% at center, rgba(30,58,138,0) 30%, rgba(30,58,138,1) 50%)`;

  return (
    <>
      {/* Carousel section */}
      <div
        className="bg-blue-900 overflow-clip flex justify-center items-center w-full border-border border-4 grid-bg-dot"
        style={{ height: "calc(65vh)" }}
      >
        <Carousel>
          <CarouselContent>
            {systems.map((system, index) => (
              <CarouselItem key={index}>
                <Card className="shadow-none">
                  <CardContent className="flex flex-col items-center justify-center">
                    <Link href={system.link} passHref>
                      <div className="group flex flex-col items-center transition-transform duration-150 hover:scale-110 select-none relative">
                        {/* Image and gradient */}
                        <div className="relative w-full">
                          <Image
                            src={system.image}
                            alt={system.name}
                            width={0}
                            height={0}
                            sizes="190vw"
                            className="w-full h-full object-cover"
                            priority={index === 0}
                          />
                          <div
                            className="pointer-events-none absolute -inset-0.5"
                            style={{ background: gradientOverlay }}
                          />
                        </div>

                        {/* System label */}
                        <p className="text-white border-white bg-gray-300/10 border-2 font-bold py-2 px-4 mt-8 text-lg grid-bg-sm group-hover:underline">
                          {system.name}
                        </p>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Welcome section */}
      <div className="w-full py-8 px-4">
        <div className="flex flex-col items-center text-center">
          {user && (
            <>
              <h2 className="text-black text-lg font-bold">{`Welcome, ${user.name}!`}</h2>
              <p className="text-gray-500 mt-2 mb-4">Take the preference quiz to get started</p>
              {error && <p className="text-red-300 text-sm">{error}</p>}
            </>
          )}

          <Link href={buttonLink} className="mt-2" passHref>
            <WelcomeButton message={buttonMessage} />
          </Link>
        </div>
      </div>
    </>
  );
}
