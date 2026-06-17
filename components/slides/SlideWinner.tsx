"use client";
import type { DeviceSpec, DesignVariant, WinnerAnalysis } from "@/types";

interface Props {
  device1: DeviceSpec;
  device2: DeviceSpec;
  variant: DesignVariant;
  winner: WinnerAnalysis;
}

interface CategoryRowProps {
  label: string;
  icon: string;
  winner: string;
  device1Name: string;
  device2Name: string;
  color1: string;
  color2: string;
  cardBg: string;
  text: string;
}

function CategoryRow({ label, icon, winner, device1Name, device2Name, color1, color2, cardBg, text }: CategoryRowProps) {
  const isD1 = winner === device1Name;
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: cardBg }}>
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-bold opacity-50 flex-1 uppercase tracking-wider">{label}</span>
      <span className="text-xs font-black px-3 py-1 rounded-full"
        style={{ background: isD1 ? `${color1}22` : `${color2}22`, color: isD1 ? color1 : color2, border: `1px solid ${isD1 ? color1 : color2}44` }}>
        {winner}
      </span>
    </div>
  );
}

export default function SlideWinner({ device1, device2, variant, winner }: Props) {
  const winnerDevice = winner.overall === device1.name ? device1 : device2;
  const winnerColor = winner.overall === device1.name ? variant.accent1 : variant.accent2;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden select-none"
      style={{ background: variant.bg, color: variant.text, fontFamily: "'Inter', sans-serif" }}>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full opacity-15"
          style={{ background: winnerColor, filter: "blur(80px)", transform: "translate(-50%, -50%)" }} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🏆</div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase opacity-50">Resultado Final</p>
            <h2 className="text-2xl font-black">Vencedor</h2>
          </div>
        </div>
        <div className="text-xs opacity-30 font-mono">8/8</div>
      </div>

      {/* Winner */}
      <div className="flex flex-col items-center py-4 px-6">
        {winnerDevice.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={winnerDevice.image} alt={winnerDevice.name}
            className="object-contain mb-2"
            style={{ height: 120, filter: `drop-shadow(0 0 24px ${winnerColor}88)` }} />
        )}
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest opacity-50 mb-1">🥇 Vencedor Geral</p>
          <h3 className="text-xl font-black" style={{ color: winnerColor }}>{winner.overall}</h3>
          <p className="text-xs opacity-50 mt-1 max-w-xs text-center">{winner.overallReason}</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-2 px-5 flex-1 overflow-hidden">
        <CategoryRow label="Desempenho" icon="⚡" winner={winner.performance}
          device1Name={device1.name} device2Name={device2.name}
          color1={variant.accent1} color2={variant.accent2} cardBg={variant.card} text={variant.text} />
        <CategoryRow label="Câmera" icon="📷" winner={winner.camera}
          device1Name={device1.name} device2Name={device2.name}
          color1={variant.accent1} color2={variant.accent2} cardBg={variant.card} text={variant.text} />
        <CategoryRow label="Tela" icon="🖥️" winner={winner.display}
          device1Name={device1.name} device2Name={device2.name}
          color1={variant.accent1} color2={variant.accent2} cardBg={variant.card} text={variant.text} />
        <CategoryRow label="Bateria" icon="🔋" winner={winner.battery}
          device1Name={device1.name} device2Name={device2.name}
          color1={variant.accent1} color2={variant.accent2} cardBg={variant.card} text={variant.text} />
        <CategoryRow label="Custo-Benefício" icon="💎" winner={winner.value}
          device1Name={device1.name} device2Name={device2.name}
          color1={variant.accent1} color2={variant.accent2} cardBg={variant.card} text={variant.text} />
      </div>

      <div className="h-1 w-full mt-3" style={{ background: `linear-gradient(90deg, ${variant.accent1}, ${variant.accent2})` }} />
    </div>
  );
}
