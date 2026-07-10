import Intro from '@/components/intro';
import CursorPill from '@/components/cursor-pill';
import ScrollRail from '@/components/scroll-rail';
import ScrollCounter from '@/components/scroll-counter';
import Nav from '@/components/nav';
import Hero from '@/components/hero';
import Marquee from '@/components/marquee';
import Work from '@/components/work';
import Manifesto from '@/components/manifesto';
import Contact from '@/components/contact';
import Footer from '@/components/footer';

export default function Page() {
  return (
    <>
      <Intro />
      <CursorPill />
      <ScrollRail />
      <ScrollCounter />
      <Nav />
      <main id="main" className="relative z-10">
        <Hero />
        <Marquee />
        <Work />
        <Manifesto />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
