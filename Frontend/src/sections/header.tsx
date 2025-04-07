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

import fruityPlanet from '@/images/earth1.jpg';
import herbalPlanet from '@/images/mercury1.jpg';
import savoryPlanet from '@/images/planet4.jpg';
import warmPlanet from '@/images/planet3.jpg';
import sweetPlanet from '@/images/neptune1.jpg';

const planets = [
  { name: 'Fruity Planet', image: fruityPlanet, link: '/notes/Fruity' },
  { name: 'Herbal Planet', image: herbalPlanet, link: '/notes/Herbal' },
  { name: 'Savory Planet', image: savoryPlanet, link: '/notes/Savory' },
  { name: 'Warm Planet', image: warmPlanet, link: '/notes/Warm' },
  { name: 'Sweet Planet', image: sweetPlanet, link: '/notes/Sweet' },
];

export default function PlanetCarousel() {
  return (
    <>
      <div className="flex justify-center items-center w-full py-10 bg-gray-900 grid-bg-dot grainy-texture">
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
      <div className="flex justify-center items-center w-full py-10 bg-white">
        <Link href="/login" passHref>
          <Button size="lg" className="h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl">
            Login & Take the Quiz
          </Button>
        </Link>
      </div>
    </>
  );
}
