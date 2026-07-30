import { ContentCalendar } from "@/components/ContentCalendar";

export default function CalendarPage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-8 px-6 py-16 text-ink md:gap-10 md:py-20">
      <header className="flex flex-col items-center gap-2 text-center md:gap-3">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">內容上線行事曆</h1>
        <p className="max-w-md text-sm text-ink/60 md:max-w-lg md:text-base">
          以月曆檢視所有取材內容，依縣市或發布狀態篩選
        </p>
      </header>

      <ContentCalendar />
    </div>
  );
}
