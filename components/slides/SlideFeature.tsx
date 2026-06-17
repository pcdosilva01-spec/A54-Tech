"use client";
import type { DeviceSpec, DesignVariant } from "@/types";

interface FeatureRow {
  label: string;
  value1: string;
  value2: string;
  bar?: boolean;
  higher?: "1" | "2" | "equal";
}

interface Props {
  device1: DeviceSpec;
  device2: DeviceSpec;
  variant: DesignVariant;
  title: string;
  icon: string;
  slideNumber: number;
  rows: FeatureRow[];
}

function BarCompare({ v1, v2, color1, color2 }: { v1: number; v2: number; color1: string; color2: string }) {
  const max = Math.max(v1, v2, 1);
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: `${color1}22` }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${(v1 / max) * 100}%`, background: color1 }} />
        </div>
        <span className="text-xs font-mono w-12 text-right opacity-70">{v1}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: `${color2}22` }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${(v2 / max) * 100}%`, background: color2 }} />
        </div>
        <span className="text-xs font-mono w-12 text-right opacity-70">{v2}</span>
      </div>
    </div>
  );
}

function parseMp(v: string) { return parseInt(v.match(/(\d+)/)?.[1] || "0"); }
function parseMah(v: string) { return parseInt(v.match(/(\d+)/)?.[1] || "0"); }

export default function SlideFeature({ device1, device2, variant, title, icon, slideNumber, rows }: Props) {
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden select-none"
      style={{ background: variant.bg, color: variant.text, fontFamily: "'Inter', sans-serif" }}>

      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: variant.accent2, filter: "blur(80px)" }} />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{icon}</div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase opacity-50">Comparação</p>
            <h2 className="text-2xl font-black">{title}</h2>
          </div>
        </div>
        <div className="text-xs opacity-30 font-mono">{slideNumber}/8</div>
      </div>

      {/* Device labels */}
      <div className="grid grid-cols-2 gap-3 px-6 py-3">
        <div className="text-center px-3 py-2 rounded-xl text-xs font-bold"
          style={{ background: `${variant.accent1}22`, color: variant.accent1, border: `1px solid ${variant.accent1}33` }}>
          {device1.name}
        </div>
        <div className="text-center px-3 py-2 rounded-xl text-xs font-bold"
          style={{ background: `${variant.accent2}22`, color: variant.accent2, border: `1px solid ${variant.accent2}33` }}>
          {device2.name}
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-3 px-6 flex-1">
        {rows.map((row, i) => {
          const n1 = parseMp(row.value1) || parseMah(row.value1);
          const n2 = parseMp(row.value2) || parseMah(row.value2);
          const showBar = row.bar && n1 > 0 && n2 > 0;
          const winner = n1 > n2 ? "1" : n2 > n1 ? "2" : "equal";

          return (
            <div key={i} className="rounded-2xl p-4" style={{ background: variant.card }}>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">{row.label}</p>
              {showBar ? (
                <BarCompare v1={n1} v2={n2} color1={variant.accent1} color2={variant.accent2} />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <span className="font-bold text-sm" style={{ color: winner === "1" ? variant.accent1 : variant.text }}>
                      {row.value1}
                    </span>
                    {winner === "1" && <span className="ml-1 text-[10px]">✦</span>}
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-sm" style={{ color: winner === "2" ? variant.accent2 : variant.text }}>
                      {row.value2}
                    </span>
                    {winner === "2" && <span className="ml-1 text-[10px]">✦</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="h-1 w-full mt-4" style={{ background: `linear-gradient(90deg, ${variant.accent1}, ${variant.accent2})` }} />
    </div>
  );
}
