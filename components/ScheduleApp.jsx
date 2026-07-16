import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Wheat,
  Apple,
  Leaf,
  Carrot,
  Sprout,
  Flower2,
  MapPin,
  Beaker,
  Wrench,
  X,
} from "lucide-react";

/* ============================================================
   デモデータ
   ============================================================ */

const CATEGORY_STYLE = {
  準備: { color: "#8B6F47", label: "準備" },
  定植: { color: "#4F7942", label: "定植・播種" },
  管理: { color: "#C79A3C", label: "管理・防除" },
  収穫: { color: "#BE5233", label: "収穫" },
};

const ICONS = {
  rice: Wheat,
  tomato: Apple,
  cabbage: Leaf,
  potato: Carrot,
  eggplant: Sprout,
  onion: Flower2,
  spinach: Leaf,
};

const CROPS = [
  { id: "rice", name: "水稲", accent: "#3F6B4A" },
  { id: "tomato", name: "トマト", accent: "#BE5233" },
  { id: "cabbage", name: "キャベツ", accent: "#5C8A5C" },
  { id: "potato", name: "ジャガイモ", accent: "#9C7A45" },
  { id: "eggplant", name: "ナス", accent: "#6B5286" },
  { id: "onion", name: "玉ねぎ", accent: "#C79A3C" },
  { id: "spinach", name: "ホウレンソウ", accent: "#3F7A4D" },
];

// タスク: monthStart〜monthEnd（1〜12）
const TASKS = [
  // 水稲
  { id: "rice-1", cropId: "rice", name: "育苗準備", cat: "準備", start: 3, end: 3,
    fertilizers: [{ name: "床土用元肥", amount: "1袋/箱", timing: "播種7日前" }],
    materials: [{ name: "育苗箱", qty: "120枚", note: "1反あたり目安" }, { name: "育苗用シート", qty: "1式", note: "保温用" }] },
  { id: "rice-2", cropId: "rice", name: "田植え", cat: "定植", start: 5, end: 5,
    fertilizers: [{ name: "全層施肥用配合肥料", amount: "40kg/10a", timing: "代かき前" }],
    materials: [{ name: "田植機", qty: "1台", note: "点検済みのもの" }, { name: "苗", qty: "必要枚数", note: "" }] },
  { id: "rice-3", cropId: "rice", name: "水管理・中干し", cat: "管理", start: 6, end: 6,
    fertilizers: [],
    materials: [{ name: "止水板", qty: "圃場数分", note: "" }] },
  { id: "rice-4", cropId: "rice", name: "追肥・防除", cat: "管理", start: 7, end: 8,
    fertilizers: [{ name: "穂肥用尿素", amount: "10kg/10a", timing: "出穂25日前" }, { name: "殺虫剤（カメムシ用）", amount: "規定量", timing: "出穂期" }],
    materials: [{ name: "動力散布機", qty: "1台", note: "" }, { name: "防護マスク", qty: "作業者分", note: "" }] },
  { id: "rice-5", cropId: "rice", name: "稲刈り", cat: "収穫", start: 9, end: 9,
    fertilizers: [],
    materials: [{ name: "コンバイン", qty: "1台", note: "刃の点検必須" }, { name: "米袋・フレコン", qty: "収量分", note: "" }] },

  // トマト
  { id: "tomato-1", cropId: "tomato", name: "育苗", cat: "準備", start: 2, end: 3,
    fertilizers: [{ name: "育苗用液肥", amount: "1000倍希釈", timing: "週1回" }],
    materials: [{ name: "セルトレイ", qty: "必要枚数", note: "" }, { name: "加温設備", qty: "1式", note: "" }] },
  { id: "tomato-2", cropId: "tomato", name: "定植", cat: "定植", start: 4, end: 4,
    fertilizers: [{ name: "元肥（緩効性配合）", amount: "30kg/10a", timing: "定植前" }],
    materials: [{ name: "マルチシート", qty: "必要量", note: "黒マルチ推奨" }, { name: "支柱", qty: "株数分", note: "" }] },
  { id: "tomato-3", cropId: "tomato", name: "誘引・整枝", cat: "管理", start: 5, end: 5,
    fertilizers: [],
    materials: [{ name: "誘引紐", qty: "必要量", note: "" }, { name: "はさみ", qty: "作業者分", note: "" }] },
  { id: "tomato-4", cropId: "tomato", name: "追肥・防除", cat: "管理", start: 6, end: 6,
    fertilizers: [{ name: "液体追肥（NK主体）", amount: "灌水同時施用", timing: "2週間おき" }, { name: "殺菌剤（疫病用）", amount: "規定量", timing: "梅雨時期" }],
    materials: [{ name: "灌水チューブ", qty: "圃場分", note: "" }, { name: "噴霧器", qty: "1台", note: "" }] },
  { id: "tomato-5", cropId: "tomato", name: "収穫", cat: "収穫", start: 7, end: 9,
    fertilizers: [],
    materials: [{ name: "収穫コンテナ", qty: "必要数", note: "" }, { name: "選果台", qty: "1式", note: "" }] },

  // キャベツ
  { id: "cabbage-1", cropId: "cabbage", name: "育苗", cat: "準備", start: 8, end: 8,
    fertilizers: [{ name: "育苗培土（肥料入り）", amount: "適量", timing: "播種時" }],
    materials: [{ name: "セルトレイ", qty: "必要枚数", note: "" }] },
  { id: "cabbage-2", cropId: "cabbage", name: "定植", cat: "定植", start: 9, end: 9,
    fertilizers: [{ name: "元肥（配合肥料）", amount: "25kg/10a", timing: "定植前" }],
    materials: [{ name: "マルチシート", qty: "必要量", note: "" }, { name: "移植ごて", qty: "作業者分", note: "" }] },
  { id: "cabbage-3", cropId: "cabbage", name: "防除・追肥", cat: "管理", start: 10, end: 10,
    fertilizers: [{ name: "追肥用尿素", amount: "8kg/10a", timing: "定植3週間後" }, { name: "殺虫剤（アオムシ用）", amount: "規定量", timing: "結球初期" }],
    materials: [{ name: "防虫ネット", qty: "圃場分", note: "" }] },
  { id: "cabbage-4", cropId: "cabbage", name: "収穫", cat: "収穫", start: 11, end: 12,
    fertilizers: [],
    materials: [{ name: "収穫用包丁", qty: "作業者分", note: "" }, { name: "出荷コンテナ", qty: "必要数", note: "" }] },

  // ジャガイモ
  { id: "potato-1", cropId: "potato", name: "種イモ準備", cat: "準備", start: 2, end: 2,
    fertilizers: [],
    materials: [{ name: "種イモ", qty: "面積に応じて", note: "浴光育芽させる" }, { name: "草木灰", qty: "適量", note: "切り口消毒用" }] },
  { id: "potato-2", cropId: "potato", name: "植え付け", cat: "定植", start: 3, end: 3,
    fertilizers: [{ name: "元肥（配合肥料）", amount: "20kg/10a", timing: "植え付け時" }],
    materials: [{ name: "マルチシート", qty: "必要量", note: "" }] },
  { id: "potato-3", cropId: "potato", name: "土寄せ・防除", cat: "管理", start: 4, end: 5,
    fertilizers: [{ name: "追肥（化成肥料）", amount: "10kg/10a", timing: "芽かき後" }, { name: "殺菌剤（疫病用）", amount: "規定量", timing: "梅雨入り前" }],
    materials: [{ name: "管理機", qty: "1台", note: "土寄せ用" }] },
  { id: "potato-4", cropId: "potato", name: "収穫", cat: "収穫", start: 6, end: 6,
    fertilizers: [],
    materials: [{ name: "掘取機", qty: "1台", note: "" }, { name: "選別コンテナ", qty: "必要数", note: "" }] },

  // ナス
  { id: "eggplant-1", cropId: "eggplant", name: "育苗", cat: "準備", start: 3, end: 3,
    fertilizers: [{ name: "育苗用液肥", amount: "1000倍希釈", timing: "週1回" }],
    materials: [{ name: "ポット", qty: "必要数", note: "" }] },
  { id: "eggplant-2", cropId: "eggplant", name: "定植", cat: "定植", start: 5, end: 5,
    fertilizers: [{ name: "元肥（配合肥料）", amount: "30kg/10a", timing: "定植前" }],
    materials: [{ name: "支柱・マルチ", qty: "必要量", note: "" }] },
  { id: "eggplant-3", cropId: "eggplant", name: "整枝・防除", cat: "管理", start: 6, end: 6,
    fertilizers: [{ name: "殺虫剤（アブラムシ用）", amount: "規定量", timing: "定植3週間後" }],
    materials: [{ name: "誘引紐", qty: "必要量", note: "" }] },
  { id: "eggplant-4", cropId: "eggplant", name: "収穫", cat: "収穫", start: 7, end: 9,
    fertilizers: [{ name: "追肥（液肥）", amount: "灌水同時施用", timing: "収穫期間中" }],
    materials: [{ name: "収穫コンテナ", qty: "必要数", note: "" }] },

  // 玉ねぎ
  { id: "onion-1", cropId: "onion", name: "育苗", cat: "準備", start: 9, end: 9,
    fertilizers: [{ name: "育苗培土（肥料入り）", amount: "適量", timing: "播種時" }],
    materials: [{ name: "育苗箱", qty: "必要枚数", note: "" }] },
  { id: "onion-2", cropId: "onion", name: "定植", cat: "定植", start: 11, end: 11,
    fertilizers: [{ name: "元肥（配合肥料）", amount: "25kg/10a", timing: "定植前" }],
    materials: [{ name: "マルチシート", qty: "必要量", note: "" }] },
  { id: "onion-3", cropId: "onion", name: "追肥・防除", cat: "管理", start: 2, end: 4,
    fertilizers: [{ name: "追肥（化成肥料）", amount: "15kg/10a", timing: "2月・3月の2回" }, { name: "殺菌剤（べと病用）", amount: "規定量", timing: "多雨時" }],
    materials: [{ name: "動力散布機", qty: "1台", note: "" }] },
  { id: "onion-4", cropId: "onion", name: "収穫", cat: "収穫", start: 5, end: 6,
    fertilizers: [],
    materials: [{ name: "収穫コンテナ", qty: "必要数", note: "" }, { name: "乾燥用ネット", qty: "必要量", note: "" }] },

  // ホウレンソウ
  { id: "spinach-1", cropId: "spinach", name: "播種", cat: "定植", start: 9, end: 9,
    fertilizers: [{ name: "元肥（配合肥料）", amount: "15kg/10a", timing: "播種前" }],
    materials: [{ name: "播種機", qty: "1台", note: "条播用" }] },
  { id: "spinach-2", cropId: "spinach", name: "防除・管理", cat: "管理", start: 10, end: 10,
    fertilizers: [{ name: "追肥（液肥）", amount: "灌水同時施用", timing: "本葉3枚時" }],
    materials: [{ name: "防虫ネット", qty: "圃場分", note: "" }] },
  { id: "spinach-3", cropId: "spinach", name: "収穫", cat: "収穫", start: 11, end: 11,
    fertilizers: [],
    materials: [{ name: "収穫用包丁", qty: "作業者分", note: "" }, { name: "出荷袋", qty: "必要数", note: "" }] },
];

// 作付け図（4x4の圃場ブロック、デモ）
const FIELD_BLOCKS = [
  { id: "A1", cropId: "rice" }, { id: "A2", cropId: "rice" }, { id: "A3", cropId: "tomato" }, { id: "A4", cropId: "tomato" },
  { id: "B1", cropId: "cabbage" }, { id: "B2", cropId: "potato" }, { id: "B3", cropId: "potato" }, { id: "B4", cropId: "eggplant" },
  { id: "C1", cropId: "eggplant" }, { id: "C2", cropId: "onion" }, { id: "C3", cropId: "onion" }, { id: "C4", cropId: "spinach" },
  { id: "D1", cropId: "rice" }, { id: "D2", cropId: "tomato" }, { id: "D3", cropId: "cabbage" }, { id: "D4", cropId: "spinach" },
];

const MONTH_LABELS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

/* ============================================================
   共通パーツ
   ============================================================ */

function Header({ title, onBack, right }) {
  return (
    <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-[#DCD5C4] bg-[#F4F2EA]/95 px-3 py-3 backdrop-blur">
      {onBack && (
        <button
          onClick={onBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#3F6B4A] active:bg-[#E7E2D2]"
          aria-label="戻る"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <h1 className="flex-1 truncate text-[15px] font-bold tracking-wide text-[#26302B]">{title}</h1>
      {right}
    </div>
  );
}

function CropIcon({ cropId, size = 16, color }) {
  const Icon = ICONS[cropId] || Leaf;
  return <Icon size={size} color={color} strokeWidth={2.2} />;
}

/* ============================================================
   ガントチャート画面
   ============================================================ */

function GanttScreen({ year, setYear, onOpenTask, onOpenPlanting }) {
  const rowsByCrop = useMemo(() => {
    const map = {};
    CROPS.forEach((c) => (map[c.id] = []));
    TASKS.forEach((t) => map[t.cropId].push(t));
    return map;
  }, []);

  return (
    <div className="flex min-h-full flex-col bg-[#F4F2EA]">
      <Header
        title="年間耕作スケジュール"
        right={
          <div className="flex items-center gap-1 rounded-full bg-[#EAE5D4] px-1 py-1">
            <button
              onClick={() => setYear((y) => y - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#5B5142] active:bg-[#DCD5C4]"
              aria-label="前年度"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="min-w-[64px] text-center text-[13px] font-semibold text-[#26302B]">{year}年度</span>
            <button
              onClick={() => setYear((y) => y + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#5B5142] active:bg-[#DCD5C4]"
              aria-label="翌年度"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        }
      />

      {/* カテゴリ凡例 */}
      <div className="flex gap-3 overflow-x-auto px-3 py-2 text-[11px]">
        {Object.entries(CATEGORY_STYLE).map(([key, v]) => (
          <div key={key} className="flex shrink-0 items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: v.color }} />
            <span className="text-[#5B5142]">{v.label}</span>
          </div>
        ))}
      </div>

      {/* ガント本体（横スクロールで全月・全作業名を表示） */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-2 pb-4">
        <div
          className="rounded-xl border border-[#DCD5C4] bg-white shadow-sm"
          style={{ display: "grid", gridTemplateColumns: `160px repeat(12, minmax(92px, auto))`, width: "max-content" }}
        >
          {/* 月ヘッダー */}
          <div className="sticky left-0 top-0 z-30 border-b border-r border-[#DCD5C4] bg-[#EFEBDC] px-3 py-2 text-[12px] font-semibold text-[#5B5142]">
            作物
          </div>
          {MONTH_LABELS.map((m) => (
            <div
              key={m}
              className="sticky top-0 z-20 border-b border-l border-[#DCD5C4] bg-[#EFEBDC] py-2 text-center text-[11px] font-semibold text-[#5B5142]"
            >
              {m}
            </div>
          ))}

          {/* 作物行 */}
          {CROPS.map((crop, ri) => (
            <React.Fragment key={crop.id}>
              <button
                onClick={() => onOpenPlanting(crop.id)}
                className="sticky left-0 z-10 flex items-center gap-2 border-b border-r border-[#EAE5D4] bg-white px-3 py-3 text-left active:bg-[#F4F2EA]"
                style={{ gridColumn: 1, gridRow: ri + 2 }}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{ background: crop.accent + "22" }}
                >
                  <CropIcon cropId={crop.id} color={crop.accent} />
                </span>
                <span className="text-[13px] font-semibold text-[#26302B]">{crop.name}</span>
              </button>

              {/* 背景セル（月グリッド線） */}
              {MONTH_LABELS.map((_, mi) => (
                <div
                  key={mi}
                  className="border-b border-l border-[#EAE5D4]"
                  style={{ gridColumn: mi + 2, gridRow: ri + 2 }}
                />
              ))}

              {/* タスクバー */}
              {rowsByCrop[crop.id].map((task) => (
                <button
                  key={task.id}
                  onClick={() => onOpenTask(task)}
                  className="z-10 my-1.5 flex items-center justify-center whitespace-nowrap rounded-md px-2 text-[11px] font-semibold text-white shadow-sm active:opacity-80"
                  style={{
                    gridColumn: `${task.start + 1} / ${task.end + 2}`,
                    gridRow: ri + 2,
                    background: CATEGORY_STYLE[task.cat].color,
                    minHeight: 26,
                  }}
                >
                  {task.name}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-3 px-1 text-[11px] leading-relaxed text-[#8A8270]">
          作業内容をタップすると必要資材・肥料薬剤の詳細、作物名をタップすると作付け図が確認できます。
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   詳細情報画面（肥料薬剤・必要資材）
   ============================================================ */

function DetailScreen({ task, onBack }) {
  const crop = CROPS.find((c) => c.id === task.cropId);
  const period =
    task.start === task.end ? `${task.start}月` : `${task.start}月〜${task.end}月`;

  return (
    <div className="flex min-h-full flex-col bg-[#F4F2EA]">
      <Header title="作業詳細" onBack={onBack} />

      <div className="px-4 pt-4">
        <div
          className="rounded-2xl px-4 py-4 text-white shadow-sm"
          style={{ background: crop.accent }}
        >
          <div className="flex items-center gap-2 text-[12px] opacity-90">
            <CropIcon cropId={crop.id} size={14} color="#fff" />
            <span>{crop.name}</span>
            <span>・{period}</span>
          </div>
          <div className="mt-1 text-[18px] font-bold">{task.name}</div>
          <span
            className="mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{ background: "rgba(255,255,255,0.22)" }}
          >
            {CATEGORY_STYLE[task.cat].label}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4 px-4 py-4">
        {/* 肥料・薬剤 */}
        <section className="overflow-hidden rounded-xl border border-[#DCD5C4] bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#EAE5D4] bg-[#EFEBDC] px-3 py-2">
            <Beaker size={15} className="text-[#3F6B4A]" />
            <h2 className="text-[13px] font-bold text-[#26302B]">肥料・薬剤</h2>
          </div>
          {task.fertilizers.length === 0 ? (
            <p className="px-3 py-4 text-[12px] text-[#8A8270]">この作業に登録された肥料・薬剤はありません。</p>
          ) : (
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-[#FAF8F2] text-[#8A8270]">
                  <th className="px-3 py-2 text-left font-semibold">品目</th>
                  <th className="px-3 py-2 text-left font-semibold">使用量</th>
                  <th className="px-3 py-2 text-left font-semibold">時期</th>
                </tr>
              </thead>
              <tbody>
                {task.fertilizers.map((f, i) => (
                  <tr key={i} className="border-t border-[#EAE5D4]">
                    <td className="px-3 py-2 font-medium text-[#26302B]">{f.name}</td>
                    <td className="px-3 py-2 text-[#5B5142]">{f.amount}</td>
                    <td className="px-3 py-2 text-[#5B5142]">{f.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* 必要資材 */}
        <section className="overflow-hidden rounded-xl border border-[#DCD5C4] bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#EAE5D4] bg-[#EFEBDC] px-3 py-2">
            <Wrench size={15} className="text-[#C79A3C]" />
            <h2 className="text-[13px] font-bold text-[#26302B]">必要資材</h2>
          </div>
          {task.materials.length === 0 ? (
            <p className="px-3 py-4 text-[12px] text-[#8A8270]">この作業に登録された資材はありません。</p>
          ) : (
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-[#FAF8F2] text-[#8A8270]">
                  <th className="px-3 py-2 text-left font-semibold">品目</th>
                  <th className="px-3 py-2 text-left font-semibold">数量目安</th>
                  <th className="px-3 py-2 text-left font-semibold">備考</th>
                </tr>
              </thead>
              <tbody>
                {task.materials.map((m, i) => (
                  <tr key={i} className="border-t border-[#EAE5D4]">
                    <td className="px-3 py-2 font-medium text-[#26302B]">{m.name}</td>
                    <td className="px-3 py-2 text-[#5B5142]">{m.qty}</td>
                    <td className="px-3 py-2 text-[#5B5142]">{m.note || "―"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

/* ============================================================
   作付け図画面
   ============================================================ */

function PlantingScreen({ cropId, onBack }) {
  const crop = CROPS.find((c) => c.id === cropId);
  const highlightedCount = FIELD_BLOCKS.filter((b) => b.cropId === cropId).length;

  return (
    <div className="flex min-h-full flex-col bg-[#F4F2EA]">
      <Header title="作付け図" onBack={onBack} />

      <div className="px-4 pt-4">
        <div className="flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: crop.accent + "22" }}
          >
            <CropIcon cropId={crop.id} color={crop.accent} />
          </span>
          <div>
            <div className="text-[15px] font-bold text-[#26302B]">{crop.name}</div>
            <div className="text-[11px] text-[#8A8270]">作付けブロック：{highlightedCount}区画</div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4">
        <div className="rounded-2xl border border-[#DCD5C4] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-1.5 text-[11px] text-[#8A8270]">
            <MapPin size={13} />
            <span>圃場ブロック配置（デモ）</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {FIELD_BLOCKS.map((b) => {
              const isTarget = b.cropId === cropId;
              const blockCrop = CROPS.find((c) => c.id === b.cropId);
              return (
                <div
                  key={b.id}
                  className="flex aspect-square flex-col items-center justify-center rounded-lg border text-center transition-opacity"
                  style={{
                    background: isTarget ? blockCrop.accent : blockCrop.accent + "14",
                    borderColor: isTarget ? blockCrop.accent : "#EAE5D4",
                    opacity: isTarget ? 1 : 0.55,
                  }}
                >
                  <CropIcon cropId={b.cropId} size={16} color={isTarget ? "#fff" : blockCrop.accent} />
                  <span
                    className="mt-1 text-[10px] font-bold"
                    style={{ color: isTarget ? "#fff" : "#8A8270" }}
                  >
                    {b.id}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-[#8A8270]">
            色付きのブロックが「{crop.name}」の作付け区画です。実際の圃場データと連携すると、区画ごとの面積や座標も表示できます。
          </p>
        </div>

        <button
          disabled
          className="mt-4 w-full rounded-xl border border-dashed border-[#DCD5C4] bg-white py-3 text-[12px] font-semibold text-[#B4AC98]"
        >
          来年度の作付け資料を作成（準備中）
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   ルート
   ============================================================ */

export default function App() {
  const [year, setYear] = useState(2026);
  const [screen, setScreen] = useState({ name: "gantt" });

  return (
    <div className="mx-auto h-screen max-w-md overflow-hidden bg-[#F4F2EA] font-sans">
      <div className="h-full overflow-y-auto">
        {screen.name === "gantt" && (
          <GanttScreen
            year={year}
            setYear={setYear}
            onOpenTask={(task) => setScreen({ name: "detail", task })}
            onOpenPlanting={(cropId) => setScreen({ name: "planting", cropId })}
          />
        )}
        {screen.name === "detail" && (
          <DetailScreen task={screen.task} onBack={() => setScreen({ name: "gantt" })} />
        )}
        {screen.name === "planting" && (
          <PlantingScreen cropId={screen.cropId} onBack={() => setScreen({ name: "gantt" })} />
        )}
      </div>
    </div>
  );
}
