import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="dark:bg-secondaryBlack inset-0 flex min-h-[60dvh] w-full flex-col items-center justify-center bg-slate-800 grid-bg-dark">
      <div className="mx-auto w-container max-w-full px-5 py-[110px] text-center lg:py-[150px]">
        <h1 className="text-white text-3xl font-heading md:text-4xl lg:text-5xl">
          Website Title
        </h1>
        <p className="text-white my-12 mt-8 text-lg font-normal leading-relaxed md:text-xl lg:text-2xl lg:leading-relaxed">
          Welcome!
        </p>
        <Link href="/subpage1" passHref>
          <Button size="lg" className="h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl">
            Begin
          </Button>
        </Link>
      </div>
    </header>
  )
}
