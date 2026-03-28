import { ReactNode } from "react";

type BgVariant = "dark" | "black" | "warm" | "gray";

const bgMap: Record<BgVariant, string> = {
  dark: "bg-void text-cream",
  black: "bg-ink text-cream",
  warm: "bg-cream text-ink",
  gray: "bg-cream text-ink",
};

export default function SectionWrapper({
  id,
  bg = "dark",
  children,
  className = "",
  fullScreen = false,
  noPadding = false,
}: {
  id: string;
  bg?: BgVariant;
  children: ReactNode;
  className?: string;
  fullScreen?: boolean;
  noPadding?: boolean;
}) {
  return (
    <section
      id={id}
      className={`${bgMap[bg]} ${fullScreen ? "min-h-screen flex flex-col justify-center" : ""} ${className}`}
    >
      <div
        className={`mx-auto w-full max-w-7xl ${noPadding ? "" : "px-6 md:px-12"} ${
          fullScreen ? "flex-1 flex flex-col justify-center px-6 md:px-12" : noPadding ? "" : "py-24 md:py-40"
        }`}
      >
        {children}
      </div>
    </section>
  );
}
