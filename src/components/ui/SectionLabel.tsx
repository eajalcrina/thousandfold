export default function SectionLabel({
  text,
  number
}: {
  text: string;
  number?: string;
}) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 mb-8 md:mb-12 flex-wrap">
      {number && (
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-mute shrink-0">
          {number}
        </span>
      )}
      <div className="w-6 sm:w-8 h-px bg-signal shrink-0" />
      <span className="font-mono text-[10px] sm:text-[0.6875rem] tracking-[0.12em] sm:tracking-[0.2em] text-mute uppercase">
        {text}
      </span>
    </div>
  );
}
