import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { ProductLines } from '@/components/ProductLines'
import { HowItWorks } from '@/components/HowItWorks'
import { SocialProof } from '@/components/SocialProof'
import { ProblemSolution } from '@/components/ProblemSolution'
import { Testimonials } from '@/components/Testimonials'
import { FAQ } from '@/components/FAQ'
import { CTAFinal } from '@/components/CTAFinal'
import { Footer } from '@/components/Footer'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductLines />
        <HowItWorks />
        <SocialProof />
        <ProblemSolution />
        <Testimonials />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
