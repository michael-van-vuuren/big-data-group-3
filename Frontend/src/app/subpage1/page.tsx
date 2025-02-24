import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Visualization from '@/sections/visualization'
import Divider from '@/components/divider'

export default function SubPage1() {
  return (
    <>
      <h1 className="text-3xl font-heading md:text-4xl lg:text-5xl py-6 pl-10">
        Sub Page 1
      </h1>
      <Divider />
      <Visualization />
      <Divider>
        <div className="px-5 py-[10px] text-center">
          <Link href="/" passHref>
            <Button size="lg" className="text-base font-heading md:text-lg lg:h-14 lg:text-xl">
              Home
            </Button>
          </Link>
        </div>
      </Divider>
    </>
  )
}
