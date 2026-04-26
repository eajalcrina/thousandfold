"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import TextReveal from "@/components/motion/TextReveal";
import FadeIn from "@/components/motion/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { motion, AnimatePresence } from "motion/react";

const HERO_IMAGES = [
  "/images/hero/amit-rai-fOaC7rpstZg-unsplash.jpg",
  "/images/hero/andres-medina-JVUCzgbTjDE-unsplash.jpg",
  "/images/hero/brianna-parks-GsDL8h0KIv8-unsplash.jpg",
  "/images/hero/carl-heyerdahl-KE0nC8-58MQ-unsplash.jpg",
  "/images/hero/joel-jasmin-forestbird-xzPMUMDDsfk-unsplash.jpg",
  "/images/hero/keagan-henman-pPxJTtxfV1A-unsplash.jpg",
  "/images/hero/marek-piwnicki-A1IoRfRQHuk-unsplash.jpg",
  "/images/hero/marek-piwnicki-aPnH05tdPkg-unsplash.jpg",
  "/images/hero/nowbelov-2b6wWzJCSKU-unsplash.jpg",
  "/images/hero/brands-people-0adHvNJu-Zo-unsplash.jpg",
];

const INTERVAL = 500;

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const advance = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  useEffect(() => {
    const timer = setTimeout(advance, INTERVAL);
    return () => clearTimeout(timer);
  }, [currentIndex, advance]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-void"
    >
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_IMAGES[currentIndex]}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark overlay to ensure text readability */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(28,26,25,0.82) 0%, rgba(28,26,25,0.75) 50%, rgba(28,26,25,0.90) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 md:px-12 flex-1 flex flex-col justify-center pt-20 md:pt-0">
        {/* Decorative corner text */}
        <div className="absolute top-32 right-8 hidden lg:block">
          <span className="font-mono text-[0.625rem] tracking-[0.3em] text-cream/20 rotate-90 block origin-top-right">
            ALC · LATAM · 2026
          </span>
        </div>

        <div className="max-w-5xl">
          <SectionLabel
            number="//00"
            text="INICIATIVA COLECTIVA PARA MARCAS REGENERATIVAS"
          />

          <TextReveal>
            <h1 className="text-[clamp(2.5rem,8vw,80px)] font-normal leading-[1.02] tracking-[-0.03em] text-cream">
              América Latina tiene el capital natural más extraordinario del
              mundo.
            </h1>
          </TextReveal>

          <TextReveal delay={0.15}>
            <p className="text-[clamp(2.5rem,8vw,80px)] font-normal leading-[1.02] tracking-[-0.03em] text-signal mt-2">
              Lo que no tiene todavía son marcas que lo regeneren.
            </p>
          </TextReveal>

          <FadeIn delay={0.4} className="mt-10">
            <p className="text-sm sm:text-base md:text-lg text-cream/60 max-w-xl leading-relaxed">
              ThousandFold es la iniciativa colectiva que reúne expertos
              apasionados para construir marcas que regeneren la biodiversidad,
              comunidades y cultura de ALC.
            </p>
          </FadeIn>

          <FadeIn delay={0.6} className="mt-10">
            <div className="flex gap-4 flex-wrap">
              <Button href="/diagnostico" variant="primary">
                Diagnostica tu marca
              </Button>
              <Button href="#libro" variant="ghost">
                Descargar RIZOMA
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll line indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          className="w-px h-10 bg-signal"
          animate={{ opacity: [0.2, 1, 0.2], scaleY: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </div>
    </section>
  );
}
