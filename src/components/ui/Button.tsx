import { ReactNode, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "text";

const variants: Record<Variant, string> = {
  primary:
    "bg-signal text-cream hover:bg-flash font-medium px-8 py-4 transition-all duration-300 hover:translate-y-[-1px]",
  ghost:
    "border border-wire text-cream hover:border-signal hover:text-signal px-8 py-4 transition-all duration-300",
  text: "text-mute hover:text-signal transition-colors duration-300 px-0 py-0",
};

function isExternal(href: string) {
  return href.startsWith("http") || href.startsWith("//");
}

export default function Button({
  variant = "primary",
  children,
  href,
  className = "",
  ...props
}: {
  variant?: Variant;
  children: ReactNode;
  href: string;
  className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const externalProps = isExternal(href)
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <a
      href={href}
      className={`inline-block text-sm tracking-wider uppercase font-mono ${variants[variant]} ${className}`}
      {...externalProps}
      {...props}
    >
      {children}
    </a>
  );
}
