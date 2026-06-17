"use client";
import type { DeviceSpec, DesignVariant } from "@/types";

interface Props {
  device1: DeviceSpec;
  device2: DeviceSpec;
  variant: DesignVariant;
}

const SPEC_ROWS = [
  { label: "Tela", key: "display" },
  { label: "Processador", key: "chipset" },
  { label: "RAM", key: "ram" },
  { label: "Armazenamento", key: "storage" },
  { label: "Câmera", key: "mainCamera" },
  { label: "Bateria", key: "battery" },
  { label: "Sistema", key: "os" },
  { label: "Peso", key: "weight" },
] as const;

export default function SlideSpecs({ device1, device2, variant }: Props) {
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden select-none"
      style={{ background: variant.bg, color: variant.text, fontFamily: "'Inter', sans-serif" }}>

      {/* BG accent */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
        style={{ background: variant.accent1, filter: "blur(60px)" }} />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase opacity-50">Especificações</p>
          <h2 className="text-2xl font-black">Comparação Geral</h2>
        </div>
        <div className="text-xs opacity-30 font-mono">2/8</div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_80px_1fr] gap-1 px-4 pb-2">
        <div className="text-center">
          <p className="text-xs font-bold truncate" style={{ color: variant.accent1 }}>{device1.name}</p>
        </div>
        <div />
        <div className="text-center">
          <p className="text-xs font-bold truncate" style={{ color: variant.accent2 }}>{device2.name}</p>
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-1 px-4 flex-1 overflow-hidden">
        {SPEC_ROWS.map((row, i) => {
          const v1 = device1.specs[row.key] || "N/A";
          const v2 = device2.specs[row.key] || "N/A";
          return (
            <div key={row.key} className="grid grid-cols-[1fr_80px_1fr] items-center gap-1"
              style={{ background: i % 2 === 0 ? `${variant.card}` : "transparent", borderRadius: 8, padding: "6px 8px" }}>
              <div className="text-center">
                <p className="text-xs font-semibold leading-tight">{v1}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-wider">{row.label}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold leading-tight">{v2}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer line */}
      <div className="h-1 w-full mt-4" style={{ background: `linear-gradient(90deg, ${variant.accent1}, ${variant.accent2})` }} />
    </div>
  );
}
