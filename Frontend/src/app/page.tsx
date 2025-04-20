"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Card, CardContent } from '@/components/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/carousel';
import Image from 'next/image';
import Link from 'next/link';
import WelcomeButton from '@/components/welcome-button';
import Logo from '@/components/logo';

const systems = [
  { name: 'Fruity System', image: '/systems/fruity.png', link: '/flavors/Fruity' },
  { name: 'Herbal System', image: '/systems/herbal.png', link: '/flavors/Herbal' },
  { name: 'Sweet System', image: '/systems/sweet.png', link: '/flavors/Sweet' },
  { name: 'Savory System', image: '/systems/savory.png', link: '/flavors/Savory' },
  { name: 'Warm System', image: '/systems/warm.png', link: '/flavors/Warm' },
];


export default function Home() {
  const { user, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  let buttonMessage: string = "Log In";
  let buttonLink: string = "/login";
  let description: string = "";
  if (user && user.role === "BUSINESS") {
    buttonMessage = "View Business Dashboard";
    buttonLink = "/business/dashboard";
    description = "Add your products";
  }
  if (user && user.role === "USER") {
    buttonMessage = "Get Started";
    buttonLink = "/flavors/Fruity";
    description = "Explore the catalog";
  }

  if (isLoading) return null;

  const gradientOverlay = `radial-gradient(ellipse 100% 80% at center, rgba(30,58,138,0) 30%, rgba(30,58,138,1) 50%)`;

  return (
    <>
      {/* Carousel section */}
      <div
        className="bg-blue-900 overflow-clip flex justify-center items-center w-screen border-border border-4 grid-bg-dot"
        style={{ height: 'calc(100vh - 58px)' }}
      >
        <Carousel>
          <CarouselContent>
            {systems.map((system, index) => (
              <CarouselItem key={index} className="w-full">
                <Card className="shadow-none w-full">
                  <CardContent className="flex flex-col justify-center">
                    <Link href={system.link} passHref>
                      <div className="group flex flex-col items-center transition-transform duration-150 hover:scale-105 select-none relative w-full">
                        
                        {/* System label */}
                        <p className="text-white border-white bg-gray-300/10 border-2 font-bold py-2 px-4 mb-8 text-md grid-bg-sm group-hover:underline">
                          {system.name}
                        </p>

                        {/* Image and gradient */}
                        <div className="relative w-full max-w-3xl h-[300px] mx-auto mb-24 hover:animate-pulse" style={{ animationDuration: '1.5s' }}>
                          <Image
                            src={system.image}
                            alt={system.name}
                            fill
                            className="object-cover"
                            priority={index === 0}
                          />
                          <div
                            className="pointer-events-none absolute inset-0"
                            style={{ background: gradientOverlay }}
                          />
                        </div>
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
      </div >

      {/* Welcome section */}
      < div className="fixed bottom-0 sm:bottom-8 left-0 sm:left-8 z-50" >
        <div className="bg-white flex items-center gap-8 border-black border-4 p-4">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="flex flex-col justify-center">
            {user && (
              <div className="text-start">
                <h2 className="text-black text-md font-bold">{`Welcome, ${user.name}!`}</h2>
                <p className="text-gray-500 mt-2 mb-4 text-md">{description}</p>
                {error && <p className="text-red-300 text-sm">{error}</p>}
              </div>
            )}

            <Link href={buttonLink} passHref>
              <WelcomeButton message={buttonMessage} />
            </Link>
          </div>
        </div>
      </div >


    </>
  );
}
