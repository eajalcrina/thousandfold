export default function SectionLabel({
  text,
  number
}: {
  text: string;
  number?: string;
}) {
  return (
    <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-12">
      {number && (
        <span className="font-mono text-xs tracking-[0.2em] text-mute shrink-0 mt-0.5 sm:mt-0">
          {number}
        </span>
      )}
      <div className="w-6 sm:w-8 h-px bg-signal shrink-0 mt-2 sm:mt-0" />
      <span className="font-mono text-[0.625rem] sm:text-[0.6875rem] tracking-[0.15em] sm:tracking-[0.2em] text-mute uppercase leading-relaxed">
        {text}
      </span>
    </div>
  );
}
