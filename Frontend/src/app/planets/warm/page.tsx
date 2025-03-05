import Image from 'next/image';
import styles from '../../../sections/styles.module.css';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <header className={`${styles.starBg} flex min-h-[300dvh] w-full flex-col items-center justify-center`}>
      <div className="mx-auto w-container max-w-full px-5 py-[110px] text-center lg:py-[150px] relative">
        <h1 className="text-white text-3xl font-heading md:text-4xl lg:text-5xl">
          Warm Planet
        </h1>

        {/* Planet Container */}
        <div className="grid grid-cols-2 gap-y-8 mt-10" style={{ height: 'auto' }}>
          {/* Rotating Planet1 Image */}
          <div className="relative flex justify-center items-center">
            <Link href="/planets/warm/grain" passHref>
              <div className="relative w-full h-full"> {/* Rotation container */}
                <Image 
                  src="/planet2.jpg" 
                  alt="First Planet" 
                  width={400} 
                  height={200} 
                  className={styles.rotate} // Apply animation class directly to image
                />
                <p className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold bg-black bg-opacity-50 p-3 rounded-lg font-serif">
                  Grain Planet
                </p>
              </div>
            </Link>
          </div>
          <div></div>

          {/* Rotating Planet2 Image */}
          <div></div>
          <div className="relative flex justify-center items-center">
            <Link href="/planets/warm/nut" passHref>
              <div className="relative w-full h-full"> {/* Rotation container */}
                <Image 
                  src="/earth1.jpg" 
                  alt="Second Planet" 
                  width={400} 
                  height={200} 
                  className={styles.rotate} // Apply animation class directly to image
                />
                <p className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold bg-black bg-opacity-50 p-3 rounded-lg font-serif">
                  Nut Planet
                </p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}
