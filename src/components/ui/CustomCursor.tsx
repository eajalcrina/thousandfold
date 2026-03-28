"use client";

import { useEffect, useRef, useCallback } from "react";

type Variant = "circular" | "circularCompact";

const VARIANTS = {
  circular: {
    dot: { default: 8, hover: 4, borderRadius: "50%" },
    ring: {
      default: 32,
      hover: 48,
      opacityDefault: 0.4,
      opacityHover: 0.8,
      border: "1px solid #EF4129",
      borderRadius: "50%",
    },
  },
  circularCompact: {
    dot: { default: 6, hover: 4, borderRadius: "50%" },
    ring: {
      default: 28,
      hover: 44,
      opacityDefault: 0.5,
      opacityHover: 1.0,
      border: "1px solid rgba(239,65,41,0.5)",
      borderRadius: "50%",
    },
  },
};

const LERP = 0.18;

export default function CustomCursor({ variant = "circular" }: { variant?: Variant }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);
  const config = VARIANTS[variant];

  const animate = useCallback(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    ringPos.current.x += (mouse.current.x - ringPos.current.x) * LERP;
    ringPos.current.y += (mouse.current.y - ringPos.current.y) * LERP;

    dot.style.left = `${mouse.current.x}px`;
    dot.style.top = `${mouse.current.y}px`;
    ring.style.left = `${ringPos.current.x}px`;
    ring.style.top = `${ringPos.current.y}px`;

    raf.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Skip on touch devices or reduced motion
    const isTouch = window.matchMedia("(hover: none)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Show cursor elements
    dot.style.display = "block";
    ring.style.display = "block";
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onEnter = () => {
      if (!dot || !ring) return;
      dot.style.width = `${config.dot.hover}px`;
      dot.style.height = `${config.dot.hover}px`;
      ring.style.width = `${config.ring.hover}px`;
      ring.style.height = `${config.ring.hover}px`;
      ring.style.opacity = String(config.ring.opacityHover);
    };

    const onLeave = () => {
      if (!dot || !ring) return;
      dot.style.width = `${config.dot.default}px`;
      dot.style.height = `${config.dot.default}px`;
      ring.style.width = `${config.ring.default}px`;
      ring.style.height = `${config.ring.default}px`;
      ring.style.opacity = String(config.ring.opacityDefault);
    };

    document.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(animate);

    // Attach hover listeners to interactive elements
    const interactives = document.querySelectorAll("a, button");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll("a, button").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      document.body.style.cursor = "auto";
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      observer.disconnect();
    };
  }, [config, animate]);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: config.dot.default,
          height: config.dot.default,
          borderRadius: config.dot.borderRadius,
          background: "#EF4129",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          transition: "width 0.2s ease, height 0.2s ease",
        }}
      />
      <div
        ref={ringRef}
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: config.ring.default,
          height: config.ring.default,
          border: config.ring.border,
          borderRadius: config.ring.borderRadius,
          background: "transparent",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%, -50%)",
          opacity: config.ring.opacityDefault,
          transition: "width 0.2s ease, height 0.2s ease, opacity 0.2s ease",
        }}
      />
    </>
  );
}
