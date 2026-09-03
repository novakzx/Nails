import Hero from "@/components/site/hero";
import MarqueeStrip from "@/components/site/marquee-strip";
import Intro from "@/components/site/intro";
import FeatureEditorial from "@/components/site/feature-editorial";
import ServicosDestaque from "@/components/site/servicos-destaque";
import Testemunhos from "@/components/site/testemunhos";
import Galeria from "@/components/site/galeria";
import CtaFinal from "@/components/site/cta-final";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <Intro />
      <FeatureEditorial />
      <ServicosDestaque />
      <Testemunhos />
      <Galeria />
      <CtaFinal />
    </>
  );
}
