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
import styles from '@/sections/styles.module.css';
import { Button } from '@/components/ui/button';
import LoginButton from '@/components/login-button';

import fruityPlanet from '@/images/earth1.jpg';
import herbalPlanet from '@/images/mercury1.jpg';
import savoryPlanet from '@/images/planet4.jpg';
import warmPlanet from '@/images/planet3.jpg';
import sweetPlanet from '@/images/neptune1.jpg';

const planets = [
  { name: 'Fruity Planet', image: fruityPlanet, link: '/flavors/Fruity' },
  { name: 'Herbal Planet', image: herbalPlanet, link: '/flavors/Herbal' },
  { name: 'Savory Planet', image: savoryPlanet, link: '/flavors/Savory' },
  { name: 'Warm Planet', image: warmPlanet, link: '/flavors/Warm' },
  { name: 'Sweet Planet', image: sweetPlanet, link: '/flavors/Sweet' },
];

export default function PlanetCarousel() {
  return (
    <>
      <div className="flex justify-center items-center w-full py-20 bg-blue-900 border-border border-4 grid-bg-dot">
        <Carousel className="w-full max-w-[400px]">
          <CarouselContent>
            {planets.map((planet, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Card className="shadow-none">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Link href={planet.link} passHref>
                        <div className="relative transform transition-transform duration-150 hover:scale-110 select-none">
                          <Image
                            src={planet.image}
                            alt={planet.name}
                            width={360}
                            height={360}
                            style={{ objectFit: "cover" }}
                            className={styles.rotate}
                          />
                        </div>
                      </Link>
                      <p className="text-white font-bold bg-black bg-opacity-50 p-2 rounded-lg mt-3 text-lg">
                        {planet.name}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="flex justify-center items-center w-full py-10">
        <Link href="/login" passHref>
          <LoginButton />
        </Link>
      </div>
    </>
  );
}
