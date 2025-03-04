import Image from 'next/image';
import styles from './styles.module.css';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import wheel from '../TempData/tasting-notes-wheel.json';

export default function Header() {
  return (
    <header className={`${styles.starBg} flex min-h-[400dvh] w-full flex-col items-center justify-center`}>
      <div className="mx-auto w-container max-w-full px-5 py-[110px] text-center lg:py-[150px] relative">
        <h1 className="text-white text-3xl font-heading md:text-4xl lg:text-5xl">
          Coffee Galaxy!
        </h1>

        {/* Planet Container */}
        <div className="grid grid-cols-2 gap-y-8 mt-10" style={{ height: 'auto' }}>
          {/* Rotating Planet1 Image */}
          <div className="flex justify-center">
            <Image 
              src="/planet2.jpg" 
              alt="First Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
          </div>
          <div></div>
          {/* Rotating Planet2 Image */}
          <div></div>
          <div className="flex justify-center">
            <Image 
              src="/earth1.jpg" 
              alt="Second Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
          </div>
          {/* Rotating Planet3 Image */}
          <div className="flex justify-center">
            <Image 
              src="/neptune1.jpg" 
              alt="Third Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
          </div>
          <div></div>
          {/* Rotating Planet4 Image */}
          <div></div>
          <div className="flex justify-center">
            <Image 
              src="/mercury1.jpg" 
              alt="Fourth Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
          </div>
          {/* Rotating Planet5 Image */}
          <div className="flex justify-center">
            <Image 
              src="/planet3.jpg" 
              alt="Fifth Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
          </div>
          <div></div>
          {/* Rotating Planet6 Image */}
          <div></div>
          <div className="flex justify-center">
            <Image 
              src="/planet4.jpg" 
              alt="Sixth Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
          </div>
        </div>

        <Link href="/subpage1" passHref>
          <Button size="lg" className="h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl">
            Login & Take the Quiz
          </Button>
        </Link>
      </div>
    </header>
  );
}
