import type { BudgetItem, ContentProposal, ItineraryStop } from "@/types";
import { locationLabel } from "@/lib/location";

interface BuildTripPptxInput {
  tripTitle: string;
  days: number[];
  stops: ItineraryStop[];
  budgetItems: BudgetItem[];
  budgetTotal: number;
  proposals: ContentProposal[];
}

/** pptxgenjs table cell shape: `{ text, options }`. */
function cell(text: string, options?: Record<string, unknown>) {
  return { text, options: { fontSize: 10, valign: "top" as const, ...options } };
}

function headerCell(text: string) {
  return cell(text, { bold: true, fill: { color: "EEEEEE" } });
}

const TABLE_BORDER = { type: "solid" as const, color: "DDDDDD", pt: 0.5 };

/**
 * Rebuilds the trip's planning data (itinerary, budget, content proposals) into a
 * downloadable .pptx, mirroring the structure of the pre-trip planning deck this
 * data was originally transcribed from. Runs entirely client-side.
 */
export async function buildTripPptx({
  tripTitle,
  days,
  stops,
  budgetItems,
  budgetTotal,
  proposals,
}: BuildTripPptxInput) {
  const { default: PptxGenJS } = await import("pptxgenjs");
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.title = tripTitle;

  const cover = pptx.addSlide();
  cover.addText(tripTitle, { x: 0.5, y: 2.7, w: 12.3, h: 1, fontSize: 36, bold: true, align: "center" });
  cover.addText("行程規劃・預算試算・內容企劃", {
    x: 0.5,
    y: 3.7,
    w: 12.3,
    h: 0.6,
    fontSize: 16,
    align: "center",
    color: "666666",
  });

  if (stops.length > 0) {
    const slide = pptx.addSlide();
    slide.addText("行程參考", { x: 0.4, y: 0.3, fontSize: 22, bold: true });
    const rows = [[headerCell("Day"), headerCell("景點"), headerCell("交通方式"), headerCell("內容重點")]];
    for (const day of days) {
      const dayStops = stops.filter((stop) => stop.day === day);
      for (const stop of dayStops) {
        rows.push([
          cell(`Day ${day}`),
          cell(`${stop.spotName}\n${locationLabel(stop.locationId)}`),
          cell(stop.transport ?? ""),
          cell(stop.contentFocus ?? ""),
        ]);
      }
    }
    slide.addTable(rows, {
      x: 0.4,
      y: 1.0,
      w: 12.5,
      colW: [1.2, 4.2, 3.3, 3.8],
      border: TABLE_BORDER,
      autoPage: true,
      autoPageRepeatHeader: true,
      autoPageHeaderRows: 1,
    });
  }

  if (budgetItems.length > 0) {
    const slide = pptx.addSlide();
    slide.addText("預算規劃", { x: 0.4, y: 0.3, fontSize: 22, bold: true });
    const rows = [[headerCell("項目"), headerCell("建議預算"), headerCell("說明")]];
    for (const item of budgetItems) {
      rows.push([cell(item.category), cell(`NT$ ${item.amount.toLocaleString("zh-TW")}`), cell(item.note)]);
    }
    rows.push([
      cell("合計", { bold: true, fill: { color: "F5F5F5" } }),
      cell(`NT$ ${budgetTotal.toLocaleString("zh-TW")}`, { bold: true, fill: { color: "F5F5F5" } }),
      cell("", { fill: { color: "F5F5F5" } }),
    ]);
    slide.addTable(rows, {
      x: 0.4,
      y: 1.0,
      w: 12.5,
      colW: [3.2, 2.8, 6.5],
      fontSize: 11,
      border: TABLE_BORDER,
      autoPage: true,
      autoPageRepeatHeader: true,
      autoPageHeaderRows: 1,
    });
  }

  const articleProposals = proposals.filter((proposal) => proposal.type === "article");
  if (articleProposals.length > 0) {
    const slide = pptx.addSlide();
    slide.addText("文章企劃", { x: 0.4, y: 0.3, fontSize: 22, bold: true });
    const rows = [[headerCell("標題"), headerCell("大綱"), headerCell("主要關鍵字"), headerCell("次要關鍵字")]];
    for (const proposal of articleProposals) {
      rows.push([
        cell(proposal.title, { fontSize: 9 }),
        cell((proposal.outline ?? []).join("\n"), { fontSize: 8 }),
        cell(proposal.keywords.primary.join("、"), { fontSize: 8 }),
        cell(proposal.keywords.secondary.join("、"), { fontSize: 8 }),
      ]);
    }
    slide.addTable(rows, {
      x: 0.4,
      y: 1.0,
      w: 12.5,
      colW: [3.4, 4.2, 2.3, 2.6],
      border: TABLE_BORDER,
      autoPage: true,
      autoPageRepeatHeader: true,
      autoPageHeaderRows: 1,
    });
  }

  const snsProposals = proposals.filter((proposal) => proposal.type === "sns");
  if (snsProposals.length > 0) {
    const slide = pptx.addSlide();
    slide.addText("SNS 內容企劃", { x: 0.4, y: 0.3, fontSize: 22, bold: true });
    const rows = [[headerCell("格式"), headerCell("主題"), headerCell("說明")]];
    for (const proposal of snsProposals) {
      rows.push([cell(proposal.format ?? ""), cell(proposal.title), cell(proposal.summary)]);
    }
    slide.addTable(rows, {
      x: 0.4,
      y: 1.0,
      w: 12.5,
      colW: [2.2, 4.3, 6.0],
      border: TABLE_BORDER,
      autoPage: true,
      autoPageRepeatHeader: true,
      autoPageHeaderRows: 1,
    });
  }

  const youtubeProposals = proposals.filter((proposal) => proposal.type === "youtube");
  if (youtubeProposals.length > 0) {
    const slide = pptx.addSlide();
    slide.addText("YouTube 企劃", { x: 0.4, y: 0.3, fontSize: 22, bold: true });
    const rows = [[headerCell("影片架構"), headerCell("標題備案")]];
    for (const proposal of youtubeProposals) {
      rows.push([
        cell((proposal.outline ?? []).join("\n"), { fontSize: 9 }),
        cell((proposal.titleAlternatives ?? [proposal.title]).join("\n\n"), { fontSize: 9 }),
      ]);
    }
    slide.addTable(rows, {
      x: 0.4,
      y: 1.0,
      w: 12.5,
      colW: [6.25, 6.25],
      border: TABLE_BORDER,
      autoPage: true,
      autoPageRepeatHeader: true,
      autoPageHeaderRows: 1,
    });
  }

  await pptx.writeFile({ fileName: "tohoku-trip-plan.pptx" });
}
