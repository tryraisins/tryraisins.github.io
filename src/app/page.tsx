import ParticleField from '@/components/particle-field';
import CursorGlow from '@/components/cursor-glow';
import Nav from '@/components/nav';
import Hero from '@/components/hero';
import Work from '@/components/work';
import Manifesto from '@/components/manifesto';
import Contact from '@/components/contact';
import Footer from '@/components/footer';

export default function Page() {
  return (
    <>
      <ParticleField />
      <CursorGlow />
      <Nav />
      <main id="main" className="relative z-10">
        <Hero />
        <Work />
        <Manifesto />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
