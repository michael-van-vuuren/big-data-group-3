import Image from 'next/image';
import styles from '../../../../sections/styles.module.css';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <header className={`${styles.starBg} flex min-h-[300dvh] w-full flex-col items-center justify-center`}>
      <div className="mx-auto w-container max-w-full px-5 py-[110px] text-center lg:py-[150px] relative">
        <h1 className="text-white text-3xl font-heading md:text-4xl lg:text-5xl">
          Citrus Planet
        </h1>

        {/* Planet Container */}
        <div className="grid grid-cols-2 gap-y-8 mt-10" style={{ height: 'auto' }}>
          {/* Rotating Planet1 Image */}
          <div className="relative flex justify-center items-center">
            <Image 
              src="/planet2.jpg" 
              alt="First Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
            <p className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold bg-black bg-opacity-50 p-3 rounded-lg font-serif">
              Lemon Planet
            </p>
          </div>
          <div></div>

          {/* Rotating Planet2 Image */}
          <div></div>
          <div className="relative flex justify-center items-center">
            <Image 
              src="/earth1.jpg" 
              alt="Second Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
            <p className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold bg-black bg-opacity-50 p-3 rounded-lg font-serif">
              Lime Planet
            </p>
          </div>

          {/* Rotating Planet3 Image */}
          <div className="relative flex justify-center items-center">
            <Image 
              src="/planet4.jpg" 
              alt="Third Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
            <p className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold bg-black bg-opacity-50 p-3 rounded-lg font-serif">
              Lemon Grass Planet
            </p>
          </div>
          <div></div>

          {/* Rotating Planet4 Image */}
          <div></div>
          <div className="relative flex justify-center items-center">
            <Image 
              src="/mercury1.jpg" 
              alt="Fourth Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
            <p className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold bg-black bg-opacity-50 p-3 rounded-lg font-serif">
              Orange Planet
            </p>
          </div>

          {/* Rotating Planet5 Image */}
          <div className="relative flex justify-center items-center">
            <Image 
              src="/planet3.jpg" 
              alt="Fifth Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
            <p className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold bg-black bg-opacity-50 p-3 rounded-lg font-serif">
              Blood Orange Planet
            </p>
          </div>
          <div></div>

          {/* Rotating Planet6 Image */}
          <div></div>
          <div className="relative flex justify-center items-center">
            <Image 
              src="/mercury1.jpg" 
              alt="Fourth Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
            <p className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold bg-black bg-opacity-50 p-3 rounded-lg font-serif">
              Grape Fruit Planet
            </p>
          </div>

          {/* Rotating Planet7 Image */}
          <div className="relative flex justify-center items-center">
            <Image 
              src="/planet3.jpg" 
              alt="Fifth Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
            <p className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold bg-black bg-opacity-50 p-3 rounded-lg font-serif">
              Tangerine Planet
            </p>
          </div>
          <div></div>

          {/* Rotating Planet8 Image */}
          <div></div>
          <div className="relative flex justify-center items-center">
            <Image 
              src="/mercury1.jpg" 
              alt="Fourth Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
            <p className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold bg-black bg-opacity-50 p-3 rounded-lg font-serif">
              Yuzu Planet
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}
