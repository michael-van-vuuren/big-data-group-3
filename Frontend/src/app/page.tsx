import Community from '@/sections/community'
import Features from '@/sections/features'
import Header from '@/sections/header'
import Faq from '@/sections/faq'
import Pricing from '@/sections/pricing'
import Footer from '@/components/footer'
import Visualization from '@/sections/visualization'
import Divider from '@/components/divider'
import CoffeeGlobe from '@/components/CoffeeGlobe'  // ✅ Import CoffeeGlobe

export default function Home() {
  return (
    <>
      <Header />
      <Divider />
      
      <CoffeeGlobe />   {/* ✅ This will render the interactive globe */}
      <Visualization />
      <Divider />

      <Features />
      <Divider />
      {/* <Community />
      <Faq /> */}
      <Pricing />
      <Footer />
    </>
  )
}
