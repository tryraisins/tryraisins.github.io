import Nav from '@/components/nav';
import Hero from '@/components/hero';
import Work from '@/components/work';
import Manifesto from '@/components/manifesto';
import Contact from '@/components/contact';
import Footer from '@/components/footer';

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Manifesto />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
