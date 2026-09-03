import Hero from "@/components/site/hero";
import Intro from "@/components/site/intro";
import ServicosDestaque from "@/components/site/servicos-destaque";
import Testemunhos from "@/components/site/testemunhos";
import Galeria from "@/components/site/galeria";
import CtaFinal from "@/components/site/cta-final";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <ServicosDestaque />
      <Testemunhos />
      <Galeria />
      <CtaFinal />
    </>
  );
}
