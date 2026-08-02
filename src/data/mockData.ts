import type {
  BudgetItem,
  CalendarProgress,
  ContentItem,
  CoveragePlan,
  ItineraryStop,
  Location,
  MediaAsset,
  Prefecture,
  Project,
} from "@/types";

/**
 * All 47 Japanese prefectures, each clickable on the nationwide map and able
 * to hold its own projects. The original Tohoku 7 keep their existing
 * ids/colors/icons unchanged (real content already exists under them); the
 * other 40 start out with no projects until someone creates one.
 */
export const mockPrefectures: Prefecture[] = [
  // 東北
  { id: "pref-aomori", name: "青森縣", color: "#62C8A8", icon: "Snowflake" },
  { id: "pref-iwate", name: "岩手縣", color: "#F68A9A", icon: "Mountain" },
  { id: "pref-akita", name: "秋田縣", color: "#75BBE3", icon: "Wheat" },
  { id: "pref-miyagi", name: "宮城縣", color: "#A3C079", icon: "Landmark" },
  { id: "pref-yamagata", name: "山形縣", color: "#FA9E59", icon: "TreePine" },
  { id: "pref-fukushima", name: "福島縣", color: "#F4CE5D", icon: "Castle" },
  { id: "pref-niigata", name: "新潟縣", color: "#F2994A", icon: "Sailboat" },

  // 北海道
  { id: "pref-hokkaido", name: "北海道", color: "#8FD9C4", icon: "Snowflake" },

  // 中部・北陸
  { id: "pref-toyama", name: "富山縣", color: "#E8C88A", icon: "Mountain" },
  { id: "pref-ishikawa", name: "石川縣", color: "#D9B36B", icon: "Waves" },
  { id: "pref-fukui", name: "福井縣", color: "#EFD9A6", icon: "Waves" },
  { id: "pref-nagano", name: "長野縣", color: "#C9A876", icon: "Mountain" },
  { id: "pref-yamanashi", name: "山梨縣", color: "#E8C88A", icon: "Mountain" },
  { id: "pref-gifu", name: "岐阜縣", color: "#D9B36B", icon: "TreePine" },
  { id: "pref-shizuoka", name: "靜岡縣", color: "#EFD9A6", icon: "Waves" },
  { id: "pref-aichi", name: "愛知縣", color: "#C9A876", icon: "Building2" },

  // 關東
  { id: "pref-gunma", name: "群馬縣", color: "#F5B87A", icon: "Mountain" },
  { id: "pref-tochigi", name: "栃木縣", color: "#F0A05C", icon: "TreePine" },
  { id: "pref-ibaraki", name: "茨城縣", color: "#FACB96", icon: "Wheat" },
  { id: "pref-saitama", name: "埼玉縣", color: "#F5B87A", icon: "Building2" },
  { id: "pref-chiba", name: "千葉縣", color: "#F0A05C", icon: "Waves" },
  { id: "pref-tokyo", name: "東京都", color: "#FACB96", icon: "Building2" },
  { id: "pref-kanagawa", name: "神奈川縣", color: "#F5B87A", icon: "Ship" },

  // 關西
  { id: "pref-shiga", name: "滋賀縣", color: "#A8C98A", icon: "Waves" },
  { id: "pref-kyoto", name: "京都府", color: "#93B873", icon: "Castle" },
  { id: "pref-hyogo", name: "兵庫縣", color: "#BEDCA3", icon: "Ship" },
  { id: "pref-osaka", name: "大阪府", color: "#A8C98A", icon: "Building2" },
  { id: "pref-nara", name: "奈良縣", color: "#93B873", icon: "Landmark" },
  { id: "pref-mie", name: "三重縣", color: "#BEDCA3", icon: "Waves" },
  { id: "pref-wakayama", name: "和歌山縣", color: "#A8C98A", icon: "TreePine" },

  // 中國
  { id: "pref-tottori", name: "鳥取縣", color: "#8FBEE0", icon: "Mountain" },
  { id: "pref-shimane", name: "島根縣", color: "#6FA6D1", icon: "Landmark" },
  { id: "pref-okayama", name: "岡山縣", color: "#ACD4EE", icon: "Flower2" },
  { id: "pref-hiroshima", name: "廣島縣", color: "#8FBEE0", icon: "Landmark" },
  { id: "pref-yamaguchi", name: "山口縣", color: "#6FA6D1", icon: "Waves" },

  // 四國
  { id: "pref-kagawa", name: "香川縣", color: "#C4D178", icon: "Waves" },
  { id: "pref-tokushima", name: "德島縣", color: "#B0C05E", icon: "Mountain" },
  { id: "pref-ehime", name: "愛媛縣", color: "#D8E094", icon: "Flower2" },
  { id: "pref-kochi", name: "高知縣", color: "#C4D178", icon: "Sailboat" },

  // 九州沖繩
  { id: "pref-fukuoka", name: "福岡縣", color: "#7FCDB0", icon: "Building2" },
  { id: "pref-saga", name: "佐賀縣", color: "#63B896", icon: "TreePine" },
  { id: "pref-nagasaki", name: "長崎縣", color: "#9BDCC5", icon: "Ship" },
  { id: "pref-kumamoto", name: "熊本縣", color: "#7FCDB0", icon: "Mountain" },
  { id: "pref-oita", name: "大分縣", color: "#63B896", icon: "Flame" },
  { id: "pref-miyazaki", name: "宮崎縣", color: "#9BDCC5", icon: "Sun" },
  { id: "pref-kagoshima", name: "鹿兒島縣", color: "#7FCDB0", icon: "Flame" },
  { id: "pref-okinawa", name: "沖繩縣", color: "#63B896", icon: "Anchor" },
];

/** Prefectural capitals, nested under their parent prefecture. Used for fine-grained itinerary planning. */
export const mockCities: Location[] = [
  {
    id: "city-aomori",
    type: "city",
    name: "青森市",
    prefectureName: "青森縣",
    icon: "Building2",
    parentId: "pref-aomori",
  },
  {
    id: "city-morioka",
    type: "city",
    name: "盛岡市",
    prefectureName: "岩手縣",
    icon: "Building2",
    parentId: "pref-iwate",
  },
  {
    id: "city-akita",
    type: "city",
    name: "秋田市",
    prefectureName: "秋田縣",
    icon: "Building2",
    parentId: "pref-akita",
  },
  {
    id: "city-sendai",
    type: "city",
    name: "仙台市",
    prefectureName: "宮城縣",
    icon: "Building2",
    parentId: "pref-miyagi",
  },
  {
    id: "city-yamagata",
    type: "city",
    name: "山形市",
    prefectureName: "山形縣",
    icon: "Building2",
    parentId: "pref-yamagata",
  },
  {
    id: "city-fukushima",
    type: "city",
    name: "福島市",
    prefectureName: "福島縣",
    icon: "Building2",
    parentId: "pref-fukushima",
  },
  {
    id: "city-niigata",
    type: "city",
    name: "新潟市",
    prefectureName: "新潟縣",
    icon: "Building2",
    parentId: "pref-niigata",
  },
];

/** Location-shaped view of the six prefectures, for the city-aware itinerary tooling below. */
const prefectureLocations: Location[] = mockPrefectures.map((prefecture) => ({
  id: prefecture.id,
  type: "prefecture",
  name: prefecture.name,
  prefectureName: prefecture.name,
  icon: prefecture.icon,
}));

export const mockLocations: Location[] = [...prefectureLocations, ...mockCities];

/**
 * Sample coverage content (article / YouTube / SNS) across all six prefectures.
 * Seed-only: the app reads this data from Supabase at runtime (see
 * `loadInitialState`); this array is only imported by `scripts/seed.ts`.
 */
export const mockContentItems: ContentItem[] = [
  // 青森縣
  {
    id: "content-aomori-article",
    projectId: "project-legacy-aomori",
    type: "article",
    title: "青森睡魔祭全攻略：跟著百年燈籠遊行感受夏日祭典魂",
    url: "https://example.com/articles/aomori-nebuta-festival",
    publishDate: "2026-08-02",
    status: "published",
    locationId: "city-aomori",
  },
  {
    id: "content-aomori-video",
    projectId: "project-legacy-aomori",
    type: "youtube",
    title: "弘前城賞櫻直擊！空拍公開日本三大夜櫻絕景",
    url: "https://example.com/videos/hirosaki-castle-sakura",
    publishDate: "2026-04-20",
    status: "scheduled",
    locationId: "pref-aomori",
  },
  {
    id: "content-aomori-sns",
    projectId: "project-legacy-aomori",
    type: "sns",
    title: "十和田湖紅葉即時打卡分享",
    url: "https://example.com/sns/towada-lake-autumn",
    publishDate: "2026-10-15",
    status: "draft",
    locationId: "pref-aomori",
  },

  // 岩手縣
  {
    id: "content-iwate-article",
    projectId: "project-legacy-iwate",
    type: "article",
    title: "盛岡冷麵 vs 三大麵：在地人激推的岩手美食清單",
    url: "https://example.com/articles/morioka-reimen",
    publishDate: "2026-06-10",
    status: "published",
    locationId: "city-morioka",
  },
  {
    id: "content-iwate-video",
    projectId: "project-legacy-iwate",
    type: "youtube",
    title: "平泉世界遺產中尊寺金色堂巡禮",
    url: "https://example.com/videos/hiraizumi-chusonji",
    publishDate: "2026-09-05",
    status: "scheduled",
    locationId: "pref-iwate",
  },
  {
    id: "content-iwate-sns",
    projectId: "project-legacy-iwate",
    type: "sns",
    title: "龍泉洞鐘乳石夢幻藍洞限時動態",
    url: "https://example.com/sns/ryusendo-cave",
    publishDate: "2026-11-01",
    status: "draft",
    locationId: "pref-iwate",
  },

  // 宮城縣
  {
    id: "content-miyagi-article",
    projectId: "project-legacy-miyagi",
    type: "article",
    title: "仙台一日遊：牛舌名店排隊指南",
    url: "https://example.com/articles/sendai-gyutan",
    publishDate: "2026-05-18",
    status: "published",
    locationId: "city-sendai",
  },
  {
    id: "content-miyagi-video",
    projectId: "project-legacy-miyagi",
    type: "youtube",
    title: "松島遊覽船直擊日本三景之美",
    url: "https://example.com/videos/matsushima-cruise",
    publishDate: "2026-07-30",
    status: "scheduled",
    locationId: "pref-miyagi",
  },
  {
    id: "content-miyagi-sns",
    projectId: "project-legacy-miyagi",
    type: "sns",
    title: "仙台七夕祭巨型和紙燈飾快拍",
    url: "https://example.com/sns/sendai-tanabata",
    publishDate: "2026-08-06",
    status: "draft",
    locationId: "city-sendai",
  },

  // 秋田縣
  {
    id: "content-akita-article",
    projectId: "project-legacy-akita",
    type: "article",
    title: "秋田美人湯溫泉巡禮：乳頭溫泉鄉七湯制霸",
    url: "https://example.com/articles/nyuto-onsen",
    publishDate: "2026-03-22",
    status: "published",
    locationId: "pref-akita",
  },
  {
    id: "content-akita-video",
    projectId: "project-legacy-akita",
    type: "youtube",
    title: "角館武家屋敷散策：東北小京都的春日物語",
    url: "https://example.com/videos/kakunodate-samurai",
    publishDate: "2026-04-25",
    status: "scheduled",
    locationId: "city-akita",
  },
  {
    id: "content-akita-sns",
    projectId: "project-legacy-akita",
    type: "sns",
    title: "男鹿半島生剝鬼太鼓體驗直播預告",
    url: "https://example.com/sns/oga-namahage",
    publishDate: "2026-12-10",
    status: "draft",
    locationId: "pref-akita",
  },

  // 山形縣
  {
    id: "content-yamagata-article",
    projectId: "project-legacy-yamagata",
    type: "article",
    title: "藏王樹冰絕景攻略：冬季限定的雪怪森林",
    url: "https://example.com/articles/zao-juhyo",
    publishDate: "2026-01-15",
    status: "published",
    locationId: "pref-yamagata",
  },
  {
    id: "content-yamagata-video",
    projectId: "project-legacy-yamagata",
    type: "youtube",
    title: "銀山溫泉大正浪漫夜景空拍紀錄",
    url: "https://example.com/videos/ginzan-onsen-night",
    publishDate: "2026-02-14",
    status: "scheduled",
    locationId: "pref-yamagata",
  },
  {
    id: "content-yamagata-sns",
    projectId: "project-legacy-yamagata",
    type: "sns",
    title: "山形櫻桃季採果體驗限時分享",
    url: "https://example.com/sns/yamagata-cherry-picking",
    publishDate: "2026-06-25",
    status: "draft",
    locationId: "city-yamagata",
  },

  // 福島縣
  {
    id: "content-fukushima-article",
    projectId: "project-legacy-fukushima",
    type: "article",
    title: "會津若松鶴城賞櫻與白虎隊歷史散步",
    url: "https://example.com/articles/aizu-tsuruga-castle",
    publishDate: "2026-04-08",
    status: "published",
    locationId: "pref-fukushima",
  },
  {
    id: "content-fukushima-video",
    projectId: "project-legacy-fukushima",
    type: "youtube",
    title: "大內宿合掌造聚落雪景紀實",
    url: "https://example.com/videos/ouchijuku-snow",
    publishDate: "2026-01-28",
    status: "scheduled",
    locationId: "pref-fukushima",
  },
  {
    id: "content-fukushima-sns",
    projectId: "project-legacy-fukushima",
    type: "sns",
    title: "福島桃子甜點下午茶打卡地圖",
    url: "https://example.com/sns/fukushima-peach-cafe",
    publishDate: "2026-07-20",
    status: "draft",
    locationId: "city-fukushima",
  },

  // 新潟縣
  {
    id: "content-niigata-article",
    projectId: "project-legacy-niigata",
    type: "article",
    title: "新潟越光米產地巡禮：從稻田到餐桌的極致美味",
    url: "https://example.com/articles/niigata-koshihikari",
    publishDate: "2026-09-12",
    status: "published",
    locationId: "city-niigata",
  },
  {
    id: "content-niigata-video",
    projectId: "project-legacy-niigata",
    type: "youtube",
    title: "佐渡島渡輪之旅：金山遺跡與朱鷺保護中心直擊",
    url: "https://example.com/videos/sado-island-ferry",
    publishDate: "2026-05-30",
    status: "scheduled",
    locationId: "pref-niigata",
  },
  {
    id: "content-niigata-sns",
    projectId: "project-legacy-niigata",
    type: "sns",
    title: "古町藝妓與日本酒吧巡禮限時動態",
    url: "https://example.com/sns/niigata-sake-bars",
    publishDate: "2026-11-08",
    status: "draft",
    locationId: "city-niigata",
  },

  // 福島縣 — pre-production ideas transcribed from the trip's planning deck
  // (2026_08_福島夏日漫旅.pptx), still at the candidate stage (no url/date yet).
  {
    id: "proposal-fukushima-article-guide",
    projectId: "project-legacy-fukushima",
    type: "article",
    status: "candidate",
    locationId: "pref-fukushima",
    title: "福島自由行五天四夜｜不自駕行程、景點交通與住宿安排完整攻略",
    summary: "以不自駕為主軸，涵蓋交通、五大必去景點與五天四夜行程推薦的完整攻略文。",
    outline: [
      "福島地理位置＆交通介紹",
      "福島必去景點：大內宿",
      "福島必去景點：五色沼",
      "福島必去景點：會津若松",
      "福島必去景點：柳津老街",
      "福島必去景點：只見線絕景",
      "福島深度遊五天四夜行程推薦",
      "福島交通票券與預算",
      "福島住宿推薦",
    ],
    keywords: {
      primary: ["福島自由行", "福島五天四夜"],
      secondary: ["福島不自駕", "福島交通", "福島景點", "福島直飛", "大內宿交通", "五色沼交通"],
    },
  },
  {
    id: "proposal-fukushima-article-food",
    projectId: "project-legacy-fukushima",
    type: "article",
    status: "candidate",
    locationId: "pref-fukushima",
    title: "福島必吃美食＆伴手禮｜喜多方拉麵、會津醬汁豬排、大蔥蕎麥麵與福島水蜜桃",
    summary: "整理福島代表料理、在地小吃、甜點水果與伴手禮的美食專題。",
    outline: ["福島代表料理", "福島在地小吃", "福島甜點＆水果", "福島伴手禮"],
    keywords: {
      primary: ["福島美食", "會津若松美食"],
      secondary: ["喜多方拉麵", "福島水蜜桃", "大內宿美食", "福島必吃", "會津鄉土料理"],
    },
  },
  {
    id: "proposal-fukushima-article-roundup-scenic",
    projectId: "project-legacy-fukushima",
    type: "article",
    status: "candidate",
    locationId: "pref-fukushima",
    relatedPrefectureIds: ["pref-niigata", "pref-iwate", "pref-akita"],
    title: "日本東北絕景推薦｜福島、岩手、秋田夏末必訪景點",
    summary:
      "依景觀類型分類：湖沼之藍（五色沼、田澤湖）、峽谷與地底世界（清津峽、龍泉洞）、海岸風景（岩手三陸海岸）、鐵道與山村（只見線、奧會津）、歷史街景（大內宿、角館武家屋敷）。",
    keywords: {
      primary: ["東北景點", "東北絕景", "日本東北景點"],
      secondary: ["新潟景點", "福島景點", "岩手景點", "秋田景點", "日本絕景", "日本秘境", "東北夏天", "日本9月旅遊"],
    },
  },
  {
    id: "proposal-fukushima-article-roundup-cool",
    projectId: "project-legacy-fukushima",
    type: "article",
    status: "candidate",
    locationId: "pref-fukushima",
    relatedPrefectureIds: ["pref-niigata", "pref-iwate", "pref-akita"],
    title: "日本夏天避暑去哪？東北＋新潟清涼景點推薦",
    summary:
      "以五種降溫感包裝：森林降溫（五色沼自然探勝路）、洞窟降溫（岩手龍泉洞）、溪谷降溫（新潟清津峽、秋田抱返溪谷）、湖泊降溫（秋田田澤湖）、海風降溫（岩手三陸海岸、新潟日本海）。",
    keywords: {
      primary: ["日本避暑景點", "日本夏天旅遊", "日本夏季景點", "東北夏天"],
      secondary: [
        "東北避暑",
        "日本避暑勝地",
        "日本夏天去哪",
        "日本高原景點",
        "日本洞窟景點",
        "日本溪谷",
        "日本湖泊景點",
        "夏季日本自由行",
      ],
    },
  },
  {
    id: "proposal-fukushima-article-roundup-blue",
    projectId: "project-legacy-fukushima",
    type: "article",
    status: "candidate",
    locationId: "pref-fukushima",
    relatedPrefectureIds: ["pref-niigata", "pref-iwate", "pref-akita"],
    title: "收藏日本最美的藍｜福島、新潟、岩手、秋田夢幻景點",
    summary: "串連五色沼、龍泉洞、田澤湖、清津峽水鏡與三陸海岸。",
    keywords: {
      primary: ["日本藍色景點", "東北絕景", "日本絕景"],
      secondary: ["五色沼", "龍泉洞", "田澤湖", "清津峽", "日本夢幻景點", "日本拍照景點", "日本自然景點"],
    },
  },
  {
    id: "proposal-fukushima-youtube-main",
    projectId: "project-legacy-fukushima",
    type: "youtube",
    status: "candidate",
    locationId: "pref-fukushima",
    title: "日本東北不開車也能玩？福島五天四夜自由行實測｜五色沼、大內宿、只見線",
    summary: "不自駕實測福島東北秘境，涵蓋交通、景點與花費結論的單支主打影片。",
    outline: [
      "精華＋問題開場",
      "行程與交通設定",
      "Day 1：福島機場到會津若松",
      "Day 2：不開車去五色沼",
      "Day 3：大內宿與會津若松",
      "Day 4：只見線慢旅行",
      "五天花費與不自駕結論",
    ],
    titleAlternatives: [
      "福島自由行五天四夜｜不自駕交通、景點、美食完整攻略",
      "只靠火車和巴士，走進福島三大秘境｜東北五天四夜旅行",
      "日本東北不開車也能玩？福島五天四夜自由行實測｜五色沼、大內宿、只見線",
    ],
  },
  {
    id: "proposal-fukushima-sns-ouchijuku",
    projectId: "project-legacy-fukushima",
    type: "sns",
    status: "candidate",
    locationId: "pref-fukushima",
    title: "大內宿介紹",
    summary: "交通、景點、美食",
    format: "reels",
  },
  {
    id: "proposal-fukushima-sns-fruit",
    projectId: "project-legacy-fukushima",
    type: "sns",
    status: "candidate",
    locationId: "pref-fukushima",
    title: "福島水果",
    summary: "9月水果：葡萄、梨子、水蜜桃",
    format: "reels",
  },
  {
    id: "proposal-fukushima-sns-tadami-line",
    projectId: "project-legacy-fukushima",
    type: "sns",
    status: "candidate",
    locationId: "pref-fukushima",
    title: "只見線介紹",
    summary: "交通、拍攝機位",
    format: "輪播圖文",
  },
  {
    id: "proposal-fukushima-sns-kirin-park",
    projectId: "project-legacy-fukushima",
    type: "sns",
    status: "candidate",
    locationId: "pref-fukushima",
    title: "吉利蛋公園",
    summary: "交通",
    format: "reels",
  },
  {
    id: "proposal-fukushima-sns-mascot",
    projectId: "project-legacy-fukushima",
    type: "sns",
    status: "candidate",
    locationId: "pref-fukushima",
    title: "福島吉祥物介紹",
    summary: "赤べこ由來",
    format: "reels",
  },
  {
    id: "proposal-fukushima-sns-must-eat",
    projectId: "project-legacy-fukushima",
    type: "sns",
    status: "candidate",
    locationId: "pref-fukushima",
    title: "福島必吃",
    summary: "餐廳五選",
    format: "reels",
  },
  {
    id: "proposal-fukushima-sns-goshikinuma",
    projectId: "project-legacy-fukushima",
    type: "sns",
    status: "candidate",
    locationId: "pref-fukushima",
    title: "五色沼介紹",
    summary: "交通、地理",
    format: "輪播圖文",
  },
  {
    id: "proposal-fukushima-sns-aizu",
    projectId: "project-legacy-fukushima",
    type: "sns",
    status: "candidate",
    locationId: "pref-fukushima",
    title: "會津若松介紹",
    summary: "交通、歷史",
    format: "輪播圖文",
  },
];

/**
 * Sample per-prefecture progress-calendar tasks.
 * Seed-only: see the note on `mockContentItems` above.
 */
export const mockCalendarProgress: CalendarProgress[] = [
  // 青森縣
  { id: "cal-aomori-1", projectId: "project-legacy-aomori", date: "2026-07-25", task: "確認睡魔祭拍攝許可與採訪證", completed: true },
  { id: "cal-aomori-2", projectId: "project-legacy-aomori", date: "2026-08-01", task: "整理弘前城空拍素材並剪輯初稿", completed: false },
  { id: "cal-aomori-3", projectId: "project-legacy-aomori", date: "2026-10-10", task: "十和田湖紅葉時程再確認", completed: false },

  // 岩手縣
  { id: "cal-iwate-1", projectId: "project-legacy-iwate", date: "2026-06-05", task: "盛岡冷麵店家聯繫與訪談邀約", completed: true },
  { id: "cal-iwate-2", projectId: "project-legacy-iwate", date: "2026-09-01", task: "中尊寺金色堂拍攝時段申請", completed: false },
  { id: "cal-iwate-3", projectId: "project-legacy-iwate", date: "2026-10-25", task: "龍泉洞地下水路交通確認", completed: false },

  // 宮城縣
  { id: "cal-miyagi-1", projectId: "project-legacy-miyagi", date: "2026-05-10", task: "仙台牛舌名店排班確認", completed: true },
  { id: "cal-miyagi-2", projectId: "project-legacy-miyagi", date: "2026-07-20", task: "松島遊覽船船班與空拍申請", completed: true },
  { id: "cal-miyagi-3", projectId: "project-legacy-miyagi", date: "2026-08-01", task: "七夕祭布置進度追蹤", completed: false },

  // 秋田縣
  { id: "cal-akita-1", projectId: "project-legacy-akita", date: "2026-03-10", task: "乳頭溫泉鄉住宿與湯屋預約", completed: true },
  { id: "cal-akita-2", projectId: "project-legacy-akita", date: "2026-04-15", task: "角館武家屋敷開放時間確認", completed: false },
  { id: "cal-akita-3", projectId: "project-legacy-akita", date: "2026-12-01", task: "男鹿半島生剝鬼直播設備測試", completed: false },

  // 山形縣
  { id: "cal-yamagata-1", projectId: "project-legacy-yamagata", date: "2026-01-05", task: "藏王樹冰纜車班次與天候確認", completed: true },
  { id: "cal-yamagata-2", projectId: "project-legacy-yamagata", date: "2026-02-01", task: "銀山溫泉夜景拍攝點勘景", completed: true },
  { id: "cal-yamagata-3", projectId: "project-legacy-yamagata", date: "2026-06-20", task: "櫻桃園採果採訪邀約", completed: false },

  // 福島縣
  { id: "cal-fukushima-1", projectId: "project-legacy-fukushima", date: "2026-03-20", task: "鶴城賞櫻花期預測與行程排定", completed: true },
  { id: "cal-fukushima-2", projectId: "project-legacy-fukushima", date: "2026-01-20", task: "大內宿雪景交通與路況確認", completed: true },
  { id: "cal-fukushima-3", projectId: "project-legacy-fukushima", date: "2026-07-15", task: "桃子甜點店家菜單與拍攝許可", completed: false },

  // 新潟縣
  { id: "cal-niigata-1", projectId: "project-legacy-niigata", date: "2026-05-15", task: "佐渡島渡輪船班與空拍申請", completed: true },
  { id: "cal-niigata-2", projectId: "project-legacy-niigata", date: "2026-09-01", task: "越光米農家採訪邀約與拍攝許可", completed: false },
  { id: "cal-niigata-3", projectId: "project-legacy-niigata", date: "2026-11-01", task: "古町藝妓文化採訪窗口確認", completed: false },
];

/**
 * Sample per-prefecture coverage (取材) arrangements.
 * Seed-only: see the note on `mockContentItems` above.
 */
export const mockCoveragePlans: CoveragePlan[] = [
  {
    id: "coverage-aomori-1",
    projectId: "project-legacy-aomori",
    spot: "青森睡魔祭",
    date: "2026-08-02",
    time: "16:00–20:30",
    address: "青森市新町 2丁目1-1（青森站前觀光交流中心集合）",
    referenceUrl: "https://example.com/spots/aomori-nebuta",
    notes: "採訪窗口：睡魔祭實行委員會。建議下午 4 點入場卡位拍攝遊行路線，晚間跳人（ハネト）互動需另申請隨隊採訪證。",
    checklist: [
      { id: "aomori-1-shot-1", label: "睡魔燈籠山車正面全景", done: true },
      { id: "aomori-1-shot-2", label: "跳人（ハネト）舞者特寫", done: false },
      { id: "aomori-1-shot-3", label: "夜間遊行燈光空拍", done: false },
      { id: "aomori-1-shot-4", label: "觀眾席歡呼互動畫面", done: false },
    ],
    status: "confirmed",
  },
  {
    id: "coverage-aomori-2",
    projectId: "project-legacy-aomori",
    spot: "弘前城公園",
    date: "2026-04-20",
    time: "17:30–21:00",
    address: "青森県弘前市大字下白銀町 1（弘前公園追手門）",
    referenceUrl: "https://example.com/spots/hirosaki-castle",
    notes: "夜櫻點燈時間 18:00-21:00，需事先申請三腳架使用許可。天守閣與護城河倒影為必拍重點。",
    checklist: [
      { id: "aomori-2-shot-1", label: "天守閣夜櫻點燈全景", done: true },
      { id: "aomori-2-shot-2", label: "西濠花筏（落櫻鋪水面）", done: true },
      { id: "aomori-2-shot-3", label: "護城河倒影空景", done: true },
    ],
    status: "completed",
  },
  {
    id: "coverage-iwate-1",
    projectId: "project-legacy-iwate",
    spot: "盛岡三大麵店家",
    date: "2026-06-10",
    time: "14:00–17:00",
    address: "岩手県盛岡市中ノ橋通 1丁目8-3（光原社）",
    referenceUrl: "https://example.com/spots/morioka-noodles",
    notes: "店家：光原社、東家本店。已確認可拍攝內用畫面，需於離峰時段（14:00 後）採訪，避免影響用餐客人。",
    checklist: [
      { id: "iwate-1-shot-1", label: "碗子蕎麥麵疊碗畫面", done: true },
      { id: "iwate-1-shot-2", label: "冷麵擺盤特寫", done: true },
      { id: "iwate-1-shot-3", label: "店家職人製麵過程", done: true },
    ],
    status: "completed",
  },
  {
    id: "coverage-iwate-2",
    projectId: "project-legacy-iwate",
    spot: "平泉中尊寺",
    date: "2026-09-05",
    time: "09:00–11:30",
    address: "岩手県西磐井郡平泉町平泉衣関 202",
    referenceUrl: "https://example.com/spots/chusonji",
    notes: "金色堂內部禁止攝影，僅能拍攝外觀與參道；需另申請寺方許可拍攝空景。",
    checklist: [
      { id: "iwate-2-shot-1", label: "月見坂參道杉木林", done: false },
      { id: "iwate-2-shot-2", label: "金色堂覆堂外觀", done: false },
      { id: "iwate-2-shot-3", label: "寺方許可空拍全景", done: false },
    ],
    status: "planned",
  },
  {
    id: "coverage-miyagi-1",
    projectId: "project-legacy-miyagi",
    spot: "松島遊覽船",
    date: "2026-07-30",
    time: "11:00–12:30",
    address: "宮城県宮城郡松島町松島普賢堂（松島海岸中央棧橋）",
    referenceUrl: "https://example.com/spots/matsushima-cruise",
    notes: "船班：丸文松島汽船 11:00 場次，甲板拍攝需自備防水袋，注意海鷗搶食遊客手上的仙貝畫面。",
    checklist: [
      { id: "miyagi-1-shot-1", label: "島嶼群空拍全景", done: false },
      { id: "miyagi-1-shot-2", label: "海鷗跟船特寫", done: false },
      { id: "miyagi-1-shot-3", label: "甲板乘客互動畫面", done: false },
    ],
    status: "confirmed",
  },
  {
    id: "coverage-miyagi-2",
    projectId: "project-legacy-miyagi",
    spot: "仙台牛舌名店",
    date: "2026-05-18",
    time: "11:30–13:30",
    address: "宮城県仙台市青葉区中央 1丁目（仙台站前 味の牛たん喜助）",
    referenceUrl: "https://example.com/spots/sendai-gyutan",
    notes: "店家：味の牛たん喜助 仙台站前店，已完成採訪與空景拍攝。",
    checklist: [
      { id: "miyagi-2-shot-1", label: "炭烤牛舌現烤畫面", done: true },
      { id: "miyagi-2-shot-2", label: "套餐擺盤全景", done: true },
      { id: "miyagi-2-shot-3", label: "店家排隊人潮", done: true },
    ],
    status: "completed",
  },
  {
    id: "coverage-akita-1",
    projectId: "project-legacy-akita",
    spot: "乳頭溫泉鄉",
    date: "2026-03-22",
    time: "05:30–08:00",
    address: "秋田県仙北市田沢湖田沢先達沢国有林（鶴の湯溫泉）",
    referenceUrl: "https://example.com/spots/nyuto-onsen",
    notes: "住宿：鶴の湯溫泉。露天風呂拍攝需避開一般旅客入浴時段，建議清晨 6 點前取景。",
    checklist: [
      { id: "akita-1-shot-1", label: "露天風呂晨霧空景", done: true },
      { id: "akita-1-shot-2", label: "茅葺屋本陣建築外觀", done: true },
      { id: "akita-1-shot-3", label: "乳白色溫泉水特寫", done: true },
    ],
    status: "completed",
  },
  {
    id: "coverage-akita-2",
    projectId: "project-legacy-akita",
    spot: "角館武家屋敷",
    date: "2026-04-25",
    time: "13:00–16:00",
    address: "秋田県仙北市角館町表町下丁（青柳家）",
    referenceUrl: "https://example.com/spots/kakunodate-samurai",
    notes: "武家屋敷：青柳家、石黑家。石黑家需事先預約導覽時段才能入內拍攝。",
    checklist: [
      { id: "akita-2-shot-1", label: "枝垂櫻武家屋敷街景", done: false },
      { id: "akita-2-shot-2", label: "石黑家室內導覽畫面", done: false },
      { id: "akita-2-shot-3", label: "武家屋敷黑板塀特寫", done: false },
    ],
    status: "confirmed",
  },
  {
    id: "coverage-yamagata-1",
    projectId: "project-legacy-yamagata",
    spot: "藏王樹冰",
    date: "2026-01-15",
    time: "16:30–19:00",
    address: "山形県山形市蔵王温泉（藏王纜車地藏山頂站）",
    referenceUrl: "https://example.com/spots/zao-juhyo",
    notes: "藏王纜車地藏山頂站，夜間點燈場次需另購票，天候不佳時纜車可能停駛，備妥備案日期。",
    checklist: [
      { id: "yamagata-1-shot-1", label: "雪怪樹冰夜間點燈", done: true },
      { id: "yamagata-1-shot-2", label: "纜車車廂內視角", done: true },
      { id: "yamagata-1-shot-3", label: "山頂雲海空景", done: true },
    ],
    status: "completed",
  },
  {
    id: "coverage-yamagata-2",
    projectId: "project-legacy-yamagata",
    spot: "銀山溫泉街",
    date: "2026-02-14",
    time: "18:00–20:00",
    address: "山形県尾花沢市銀山新畑（能登屋旅館前）",
    referenceUrl: "https://example.com/spots/ginzan-onsen",
    notes: "旅館：能登屋旅館。夜景拍攝最佳時間為點燈後 18:30-19:30，橋上人潮較多需提早卡位。",
    checklist: [
      { id: "yamagata-2-shot-1", label: "銀山川兩岸大正建築夜景", done: true },
      { id: "yamagata-2-shot-2", label: "石橋人力車畫面", done: false },
      { id: "yamagata-2-shot-3", label: "旅館燈籠特寫", done: true },
    ],
    status: "confirmed",
  },
  {
    id: "coverage-fukushima-1",
    projectId: "project-legacy-fukushima",
    spot: "會津若松鶴城取材",
    date: "2026-04-08",
    time: "08:30–12:00",
    address: "福島県会津若松市追手町 1-1",
    referenceUrl: "https://example.com/spots/aizu-tsuruga-castle",
    notes: "賞櫻期間天守閣周邊人潮多，建議開園時間 8:30 入場拍攝空景，白虎隊歷史街區於午後採訪。",
    checklist: [
      { id: "fukushima-1-shot-1", label: "天守閣賞櫻空景", done: true },
      { id: "fukushima-1-shot-2", label: "白虎隊歷史街區街景", done: true },
      { id: "fukushima-1-shot-3", label: "護城河櫻花倒影", done: false },
    ],
    status: "completed",
  },
  {
    id: "coverage-fukushima-2",
    projectId: "project-legacy-fukushima",
    spot: "大內宿",
    date: "2026-01-28",
    time: "10:00–14:00",
    address: "福島県南会津郡下郷町大内山本",
    referenceUrl: "https://example.com/spots/ouchijuku",
    notes: "雪景點燈活動僅特定週末舉辦，需先確認當年度「大內宿雪祭」實際日期，路況積雪需備防滑雪鞋。",
    checklist: [
      { id: "fukushima-2-shot-1", label: "茅葺屋雪景全景", done: false },
      { id: "fukushima-2-shot-2", label: "雪祭點燈夜景", done: false },
      { id: "fukushima-2-shot-3", label: "蕎麥麵店家內用畫面", done: false },
    ],
    status: "planned",
  },
  {
    id: "coverage-fukushima-3",
    projectId: "project-legacy-fukushima",
    spot: "喜多方拉麵專題",
    date: "2026-07-15",
    time: "11:00–15:00",
    address: "福島県喜多方市字諏訪 91（老舗坂内食堂）",
    referenceUrl: "https://example.com/spots/kitakata-ramen",
    notes: "喜多方為日本三大拉麵之鄉，安排造訪坂内食堂、まこと食堂兩家老店，需於開店前排隊避開人潮。",
    checklist: [
      { id: "fukushima-3-shot-1", label: "手打麵條製作過程", done: false },
      { id: "fukushima-3-shot-2", label: "叉燒醬油拉麵擺盤特寫", done: false },
      { id: "fukushima-3-shot-3", label: "老店懷舊招牌與店內裝潢", done: false },
      { id: "fukushima-3-shot-4", label: "排隊人潮空景", done: false },
    ],
    status: "planned",
  },
  {
    id: "coverage-niigata-1",
    projectId: "project-legacy-niigata",
    spot: "佐渡島渡輪之旅",
    date: "2026-05-30",
    time: "08:00–17:00",
    address: "新潟県新潟市中央区万代島 9-1（新潟港佐渡汽船碼頭）",
    referenceUrl: "https://example.com/spots/sado-island",
    notes: "搭乘佐渡汽船高速船往返，甲板拍攝需注意海風，金山遺跡需另申請館內拍攝許可。",
    checklist: [
      { id: "niigata-1-shot-1", label: "渡輪出港空拍", done: true },
      { id: "niigata-1-shot-2", label: "金山遺跡坑道內部", done: false },
      { id: "niigata-1-shot-3", label: "朱鷺保護中心朱鷺特寫", done: false },
    ],
    status: "confirmed",
  },
  {
    id: "coverage-niigata-2",
    projectId: "project-legacy-niigata",
    spot: "越光米農家採訪",
    date: "2026-09-12",
    time: "09:00–12:00",
    address: "新潟県南魚沼市塩沢（南魚沼產越光米農家）",
    referenceUrl: "https://example.com/spots/koshihikari-farm",
    notes: "農家：塩沢地區三代米農。9 月為稻穗成熟收割季，建議清晨拍攝金色稻田晨光畫面。",
    checklist: [
      { id: "niigata-2-shot-1", label: "金色稻田空拍全景", done: false },
      { id: "niigata-2-shot-2", label: "收割機作業畫面", done: false },
      { id: "niigata-2-shot-3", label: "白米蒸煮試吃特寫", done: false },
    ],
    status: "planned",
  },
];

/**
 * One legacy project per prefecture, that the original prefecture-scoped
 * content/calendar/coverage data (and, for Fukushima, the original site-wide
 * itinerary/budget) was migrated into once everything became per-project
 * (see supabase/schema.sql / the migration notes). Seed-only: see the note
 * on `mockContentItems` above.
 */
export const mockProjects: Project[] = [
  {
    id: "project-legacy-aomori",
    prefectureId: "pref-aomori",
    name: "既有資料（遷移前）",
    assignees: [],
    notes: "搬進專案制之前的舊資料，可重新命名。",
  },
  {
    id: "project-legacy-iwate",
    prefectureId: "pref-iwate",
    name: "既有資料（遷移前）",
    assignees: [],
    notes: "搬進專案制之前的舊資料，可重新命名。",
  },
  {
    id: "project-legacy-akita",
    prefectureId: "pref-akita",
    name: "既有資料（遷移前）",
    assignees: [],
    notes: "搬進專案制之前的舊資料，可重新命名。",
  },
  {
    id: "project-legacy-miyagi",
    prefectureId: "pref-miyagi",
    name: "既有資料（遷移前）",
    assignees: [],
    notes: "搬進專案制之前的舊資料，可重新命名。",
  },
  {
    id: "project-legacy-yamagata",
    prefectureId: "pref-yamagata",
    name: "既有資料（遷移前）",
    assignees: [],
    notes: "搬進專案制之前的舊資料，可重新命名。",
  },
  {
    id: "project-legacy-niigata",
    prefectureId: "pref-niigata",
    name: "既有資料（遷移前）",
    assignees: [],
    notes: "搬進專案制之前的舊資料，可重新命名。",
  },
  {
    id: "project-legacy-fukushima",
    prefectureId: "pref-fukushima",
    name: "東北六縣夏季取材踩點行程",
    assignees: [],
    notes: "搬進專案制之前的舊資料，含原本的行程與預算，可重新命名。",
  },
];

/**
 * Sample 6-day itinerary touring all six Tohoku prefectures, belonging to the
 * legacy project above. Seed-only: see the note on `mockContentItems` above.
 */
export const mockItineraryStops: ItineraryStop[] = [
  {
    id: "stop-1-fukushima",
    projectId: "project-legacy-fukushima",
    date: "2026-08-01",
    spotName: "會津若松鶴城",
    note: "抵達福島，拍攝鶴城與白虎隊歷史街區，晚上入住會津溫泉旅館。",
    locationId: "pref-fukushima",
    transport: "福島機場入境＋機場巴士轉JR至會津若松",
    contentFocus: "鶴城賞櫻空景、白虎隊歷史街區街拍",
  },
  {
    id: "stop-2-miyagi",
    projectId: "project-legacy-fukushima",
    date: "2026-08-02",
    spotName: "仙台市區＋松島",
    note: "上午取材仙台牛舌名店，下午搭乘松島遊覽船拍攝日本三景空景。",
    locationId: "pref-miyagi",
    transport: "會津若松→仙台：JR快速",
    contentFocus: "牛舌名店排隊實測、松島遊覽船空景",
  },
  {
    id: "stop-3-yamagata",
    projectId: "project-legacy-fukushima",
    date: "2026-08-03",
    spotName: "銀山溫泉",
    note: "入住銀山溫泉旅館，拍攝大正浪漫夜景與溫泉街素材。",
    locationId: "pref-yamagata",
    transport: "仙台→銀山溫泉：新幹線轉在地巴士",
    contentFocus: "大正浪漫夜景點燈、旅館住宿體驗",
  },
  {
    id: "stop-4-akita",
    projectId: "project-legacy-fukushima",
    date: "2026-08-04",
    spotName: "角館武家屋敷＋乳頭溫泉鄉",
    note: "白天散策角館武家屋敷街景，傍晚前往乳頭溫泉鄉泡湯放鬆並取材。",
    locationId: "pref-akita",
    transport: "銀山溫泉→角館：JR奧羽本線",
    contentFocus: "武家屋敷街景散策、乳頭溫泉鄉七湯巡禮",
  },
  {
    id: "stop-5-iwate",
    projectId: "project-legacy-fukushima",
    date: "2026-08-05",
    spotName: "平泉中尊寺＋盛岡市區",
    note: "上午參拜中尊寺金色堂，中午在盛岡取材冷麵與三大麵店家。",
    locationId: "pref-iwate",
    transport: "角館→平泉：秋田新幹線轉東北本線",
    contentFocus: "金色堂參道空景、盛岡三大麵店家實測",
  },
  {
    id: "stop-6-aomori",
    projectId: "project-legacy-fukushima",
    date: "2026-08-06",
    spotName: "弘前城公園＋十和田湖",
    note: "收尾行程拍攝弘前城公園與十和田湖周邊空拍素材，準備返程。",
    locationId: "pref-aomori",
    transport: "盛岡→弘前：東北新幹線轉奧羽本線",
    contentFocus: "弘前城夜櫻空拍、十和田湖收尾空景",
  },
];

/**
 * Trip budget line items for the legacy project, transcribed from the
 * planning deck's 預算規劃 slide (two-person trip).
 * Seed-only: see the note on `mockContentItems` above.
 */
export const mockBudgetItems: BudgetItem[] = [
  { id: "budget-lodging", projectId: "project-legacy-fukushima", category: "四晚住宿", amount: 14000, note: "會津若松站附近商務旅館＋一晚溫泉旅館，雙人房" },
  { id: "budget-transport", projectId: "project-legacy-fukushima", category: "機場及當地交通", amount: 7000, note: "JR、巴士、只見線及少量計程車備用" },
  { id: "budget-food", projectId: "project-legacy-fukushima", category: "五天餐飲", amount: 11000, note: "因需產出美食文章，建議多抓甜點、咖啡及多道料理" },
  { id: "budget-tickets", projectId: "project-legacy-fukushima", category: "景點門票", amount: 1200, note: "鶴城、展館等；五色沼、大內宿多數區域免費" },
  { id: "budget-connectivity", projectId: "project-legacy-fukushima", category: "網路及旅遊保險", amount: 2000, note: "兩人 eSIM＋基本旅平險" },
  { id: "budget-shooting", projectId: "project-legacy-fukushima", category: "拍攝額外支出", amount: 3000, note: "寄物櫃、飲品、補拍餐點" },
  { id: "budget-contingency", projectId: "project-legacy-fukushima", category: "緊急備用金", amount: 4000, note: "錯過班次、臨時叫車或天候調整" },
];

/**
 * Links to archived raw footage/photos (hosted externally, e.g. Google
 * Drive), organized per project. New feature: no historical data to seed.
 * Seed-only: see the note on `mockContentItems` above.
 */
export const mockMediaAssets: MediaAsset[] = [];
