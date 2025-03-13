import Header from '@/sections/header'
import Footer from '@/components/footer'
import Divider from '@/components/divider'
import CoffeeGlobe from '@/components/CoffeeGlobe' 

export default function Home() {
  return (
    <>
      <Header />
      {/* <Divider /> */}
      <CoffeeGlobe />
      {/* <Divider /> */}
      <Footer />
    </>
  )
}
