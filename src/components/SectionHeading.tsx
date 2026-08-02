import type { ClipboardList } from "lucide-react";

export function SectionHeading({
  icon: Icon,
  title,
  color,
}: {
  icon: typeof ClipboardList;
  title: string;
  color: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5 md:mb-5">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl text-ink md:h-10 md:w-10"
        style={{ backgroundColor: `${color}33` }}
      >
        <Icon size={18} className="md:h-5 md:w-5" />
      </span>
      <h2 className="text-lg font-black text-ink md:text-xl">{title}</h2>
    </div>
  );
}
