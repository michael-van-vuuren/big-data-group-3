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
import styles from './styles.module.css';
import { Button } from '@/components/ui/button';


const planets = [
  { name: 'Fruity Planet', image: '/planet2.jpg', link: '/fruity' },
  { name: 'Herbal Planet', image: '/earth1.jpg', link: '/herbal' },
  { name: 'Savory Planet', image: '/planet4.jpg', link: '/savory' },
  { name: 'Warm Planet', image: '/mercury1.jpg', link: '/warm' },
  { name: 'Sweet Planet', image: '/planet3.jpg', link: '/sweet' },
];

export default function PlanetCarousel() {
  return (
    <>
      <div className="flex justify-center items-center w-full py-10 bg-slate-900">
        <Carousel className="w-full max-w-[800px]">
          <CarouselContent>
            {planets.map((planet, index) => (
              <CarouselItem key={index}>
                <div className="p-4">
                  <Card className="shadow-none">
                    <CardContent className="flex flex-col items-center justify-center p-6 bg-slate-900">
                      <Link href={planet.link} passHref>
                        <div className="relative">
                          <Image
                            src={planet.image}
                            alt={planet.name}
                            width={360}
                            height={360}
                            objectFit="cover"
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
      <div className="flex justify-center items-center w-full py-10 bg-gray-900">
        <Link href="/subpage1" passHref>
          <Button size="lg" className="h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl">
            Login & Take the Quiz
          </Button>
        </Link>
      </div>
    </>
  );
}
