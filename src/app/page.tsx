import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import DiagnosticCTA from "@/components/sections/DiagnosticCTA";
import Book from "@/components/sections/Book";
import Framework from "@/components/sections/Framework";
import DigitalTools from "@/components/sections/DigitalTools";
import Founders from "@/components/sections/Founders";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <DiagnosticCTA />
        <Book />
        <Framework />
        <DigitalTools />
        <Founders />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
