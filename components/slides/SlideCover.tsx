"use client";
import type { DeviceSpec, DesignVariant } from "@/types";

interface Props {
  device1: DeviceSpec;
  device2: DeviceSpec;
  variant: DesignVariant;
}

export default function SlideCover({ device1, device2, variant }: Props) {
  const isCyber = variant.style === "cyber";
  const isFire = variant.style === "fire";

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none"
      style={{ background: variant.bg, color: variant.text, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20"
          style={{ background: variant.accent1, filter: "blur(80px)", transform: "translate(-30%, -30%)" }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-20"
          style={{ background: variant.accent2, filter: "blur(80px)", transform: "translate(30%, 30%)" }} />
        {isCyber && (
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, ${variant.accent1}08 40px, ${variant.accent1}08 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, ${variant.accent1}08 40px, ${variant.accent1}08 41px)`
          }} />
        )}
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center pt-8 gap-1">
        <div className="text-xs font-bold tracking-[0.3em] uppercase px-4 py-1 rounded-full"
          style={{ background: `${variant.accent1}22`, color: variant.accent1, border: `1px solid ${variant.accent1}44` }}>
          Compare Studio AI
        </div>
        <h1 className="text-4xl font-black tracking-tight mt-2" style={{ letterSpacing: "-0.02em" }}>COMPARATIVO</h1>
        <p className="text-sm opacity-60 font-medium">Qual é o melhor?</p>
      </div>

      {/* Devices */}
      <div className="relative z-10 flex items-end justify-center gap-0 w-full px-8" style={{ flex: 1 }}>
        {/* Device 1 */}
        <div className="flex flex-col items-center gap-3" style={{ flex: 1 }}>
          <div className="relative">
            {device1.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={device1.image} alt={device1.name}
                className="object-contain drop-shadow-2xl"
                style={{ height: 200, width: "auto", maxWidth: 140, filter: `drop-shadow(0 0 20px ${variant.accent1}66)` }} />
            ) : (
              <div className="w-28 h-48 rounded-2xl border-2 opacity-30" style={{ borderColor: variant.accent1 }} />
            )}
          </div>
          <div className="text-center">
            <p className="text-xs opacity-50 uppercase tracking-widest">{device1.brand}</p>
            <p className="text-sm font-bold leading-tight">{device1.name.replace(device1.brand, "").trim()}</p>
          </div>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center gap-1 pb-12 px-2">
          <div className="w-px h-16 opacity-20" style={{ background: variant.text }} />
          <div className="text-2xl font-black px-3 py-1 rounded-lg"
            style={{ background: `linear-gradient(135deg, ${variant.accent1}, ${variant.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            VS
          </div>
          <div className="w-px h-16 opacity-20" style={{ background: variant.text }} />
        </div>

        {/* Device 2 */}
        <div className="flex flex-col items-center gap-3" style={{ flex: 1 }}>
          <div className="relative">
            {device2.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={device2.image} alt={device2.name}
                className="object-contain"
                style={{ height: 200, width: "auto", maxWidth: 140, filter: `drop-shadow(0 0 20px ${variant.accent2}66)` }} />
            ) : (
              <div className="w-28 h-48 rounded-2xl border-2 opacity-30" style={{ borderColor: variant.accent2 }} />
            )}
          </div>
          <div className="text-center">
            <p className="text-xs opacity-50 uppercase tracking-widest">{device2.brand}</p>
            <p className="text-sm font-bold leading-tight">{device2.name.replace(device2.brand, "").trim()}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full flex justify-between items-center px-6 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: variant.accent1 }} />
          <span className="text-xs opacity-40">Dados via GSMArena</span>
        </div>
        <div className="text-xs opacity-30 font-mono">{isFire ? "🔥" : isCyber ? "⚡" : "✦"} 1/8</div>
      </div>
    </div>
  );
}
