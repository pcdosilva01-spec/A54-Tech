"use client";
import { useState } from "react";
import type { ComparisonData, DeviceSpec, SearchResult } from "@/types";
import { DESIGN_VARIANTS } from "@/lib/utils";
import { analyzeWinner } from "@/lib/analyze";
import DeviceSearch from "@/components/DeviceSearch";
import SlideCarousel from "@/components/SlideCarousel";

export default function Home() {
  const [sel1, setSel1] = useState<SearchResult | null>(null);
  const [sel2, setSel2] = useState<SearchResult | null>(null);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [variantIndex, setVariantIndex] = useState(0);

  const variant = DESIGN_VARIANTS[variantIndex];
  const canGenerate = !!sel1?.id && !!sel2?.id;

  async function generate() {
    if (!canGenerate) return;
    setError("");
    setLoading(true);
    setComparison(null);

    try {
      const [r1, r2] = await Promise.all([
        fetch(`/api/device-local/${sel1.id}`).then(r => r.json()),
        fetch(`/api/device-local/${sel2.id}`).then(r => r.json()),
      ]);
      if (r1.error || r2.error) throw new Error(r1.error || r2.error);
      const device1: DeviceSpec = r1;
      const device2: DeviceSpec = r2;
      setComparison({ device1, device2, winner: analyzeWinner(device1, device2), prices: { device1: "", device2: "" } });
    } catch (e) {
      setError("Erro ao buscar dados. Tente novamente.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-900 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
            <span className="text-xs font-bold">CS</span>
          </div>
          <span className="text-sm font-bold">Compare Studio</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Compare Smartphones</h1>
          <p className="text-sm text-zinc-500">Selecione dois dispositivos para gerar a comparação</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DeviceSearch
              label="Dispositivo 1"
              number={1}
              accentColor={variant.accent1}
              selected={sel1}
              onSelect={setSel1}
            />
            <DeviceSearch
              label="Dispositivo 2"
              number={2}
              accentColor={variant.accent2}
              selected={sel2}
              onSelect={setSel2}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={generate}
            disabled={loading || !canGenerate}
            className="w-full py-3 rounded-lg font-medium text-sm transition-colors bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Carregando..." : "Gerar Comparação"}
          </button>
        </div>

        {comparison && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Resultado</h2>
              <button
                onClick={() => setVariantIndex((i) => (i + 1) % DESIGN_VARIANTS.length)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Trocar tema
              </button>
            </div>
            <SlideCarousel data={comparison} variant={variant} />
          </div>
        )}
      </main>
    </div>
  );
}
