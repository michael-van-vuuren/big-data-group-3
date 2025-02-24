import Community from '@/sections/community'
import Features from '@/sections/features'
import Header from '@/sections/header'
import Faq from '@/sections/faq'
import Pricing from '@/sections/pricing'
import Footer from '@/components/footer'
import Visualization from '@/sections/visualization'
import Divider from '@/components/divider'

export default function Home() {
  return (
    <>
      <Header />
      <Features />
      <Divider />
      <Visualization />
      <Divider />
      {/* <Community />
      <Faq /> */}
      <Pricing />
      <Footer />
    </>
  )
}
