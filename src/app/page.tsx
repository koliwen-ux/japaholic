import { JapanMap } from "@/components/JapanMap";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center gap-3 px-6 py-16 text-ink md:gap-4 md:py-20">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">全日本取材地圖</h1>
        <p className="max-w-md text-sm text-ink/60 md:text-base">
          點擊彩色縣市名稱，前往專屬頁面查看取材內容與行程規劃；淡色文字為規劃中的縣市
        </p>
      </header>

      <div className="mt-6 flex w-full justify-center md:mt-10">
        <JapanMap />
      </div>
    </div>
  );
}
