import Image from 'next/image';
import styles from './styles.module.css';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Header() {
  return (
    <header 
      className="dark:bg-secondaryBlack inset-0 flex min-h-[60dvh] w-full flex-col items-center justify-center bg-slate-800 grid-bg-dark"
      style={{
        backgroundImage: 'url("/background1.jpg")',
        backgroundSize: 'cover', // This makes the image cover the whole area
        backgroundPosition: 'center', // This centers the image
        backgroundRepeat: 'no-repeat', // Prevents the image from repeating
      }}
    >
      <div className="mx-auto w-container max-w-full px-5 py-[110px] text-center lg:py-[150px] relative">
        <h1 className="text-white text-3xl font-heading md:text-4xl lg:text-5xl">
          Coffee Galaxy!
        </h1>

        {/* Planet Container */}
        <div className="flex space-x-8 flex-wrap relative" style={{ height: '900px' }}>
          {/* Rotating Planet1 Image */}
          <div className="absolute" style={{ left: '25px', top: '0px' }}>
            <Image 
              src="/planet2.jpg" 
              alt="First Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
          </div>
          {/* Rotating Planet2 Image */}
          <div className="absolute" style={{ right: '25px', top: '0px' }}>
            <Image 
              src="/earth1.jpg" 
              alt="Second Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
          </div>
          {/* Rotating Planet3 Image */}
          <div className="absolute" style={{ left: '350px', top: '50px' }}>
            <Image 
              src="/neptune1.jpg" 
              alt="Third Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
          </div>
          {/* Rotating Planet4 Image */}
          <div className="absolute" style={{ left: '350x', top: '400px' }}>
            <Image 
              src="/mercury1.jpg" 
              alt="Fourth Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
          </div>
          {/* Rotating Planet5 Image */}
          <div className="absolute" style={{ left: '375px', top: '450px' }}>
            <Image 
              src="/planet3.jpg" 
              alt="Fifth Planet" 
              width={400} 
              height={200} 
              className={styles.rotate} // Apply animation class directly to image
            />
          </div>
          {/* Rotating Planet6 Image */}
          <div className="absolute" style={{ right: '25px', top: '400px' }}>
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
