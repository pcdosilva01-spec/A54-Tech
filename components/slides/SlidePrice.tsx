"use client";
import type { DeviceSpec, DesignVariant } from "@/types";

interface Props {
  device1: DeviceSpec;
  device2: DeviceSpec;
  variant: DesignVariant;
  price1: string;
  price2: string;
  onPrice1Change: (v: string) => void;
  onPrice2Change: (v: string) => void;
  isExporting?: boolean;
}

export default function SlidePrice({ device1, device2, variant, price1, price2, onPrice1Change, onPrice2Change, isExporting }: Props) {
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden select-none"
      style={{ background: variant.bg, color: variant.text, fontFamily: "'Inter', sans-serif" }}>

      <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{ background: variant.accent1, filter: "blur(100px)", transform: "translate(-50%, -50%)" }} />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">💰</div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase opacity-50">Custo</p>
            <h2 className="text-2xl font-black">Preço</h2>
          </div>
        </div>
        <div className="text-xs opacity-30 font-mono">7/8</div>
      </div>

      {/* Price cards */}
      <div className="flex flex-col gap-4 px-6 flex-1 justify-center">
        {[
          { device: device1, price: price1, onChange: onPrice1Change, color: variant.accent1 },
          { device: device2, price: price2, onChange: onPrice2Change, color: variant.accent2 },
        ].map(({ device, price, onChange, color }, i) => (
          <div key={i} className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: variant.card, border: `1px solid ${color}33` }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: color }} />
              <p className="font-bold text-sm">{device.name}</p>
            </div>
            {isExporting ? (
              <div className="text-3xl font-black" style={{ color }}>
                {price || "A consultar"}
              </div>
            ) : (
              <input
                type="text"
                value={price}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Ex: R$ 5.999"
                className="text-3xl font-black bg-transparent border-b-2 outline-none w-full placeholder:opacity-20"
                style={{ color, borderColor: `${color}44` }}
              />
            )}
            {!isExporting && (
              <p className="text-[10px] opacity-30">Clique para editar o preço</p>
            )}
          </div>
        ))}
      </div>

      <div className="h-1 w-full mt-4" style={{ background: `linear-gradient(90deg, ${variant.accent1}, ${variant.accent2})` }} />
    </div>
  );
}
