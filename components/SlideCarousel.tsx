"use client";
import { useState, useRef } from "react";
import type { ComparisonData, DesignVariant } from "@/types";
import SlideCover from "./slides/SlideCover";
import SlideSpecs from "./slides/SlideSpecs";
import SlideFeature from "./slides/SlideFeature";
import SlidePrice from "./slides/SlidePrice";
import SlideWinner from "./slides/SlideWinner";
import html2canvas from "html2canvas";
import JSZip from "jszip";

interface Props {
  data: ComparisonData;
  variant: DesignVariant;
  onVariantChange?: () => void;
}

const SLIDE_SIZE = 540;
const THUMB_SIZE = 80;
const THUMB_SCALE = THUMB_SIZE / SLIDE_SIZE;

const SLIDE_LABELS = ["Capa", "Specs", "Tela", "CPU", "Câmera", "Bateria", "Preço", "Resultado"];

export default function SlideCarousel({ data, variant, onVariantChange }: Props) {
  const [current, setCurrent] = useState(0);
  const [prices, setPrices] = useState({ p1: "", p2: "" });
  const [exporting, setExporting] = useState(false);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  const { device1, device2, winner } = data;

  const slides = [
    <SlideCover key="cover" device1={device1} device2={device2} variant={variant} />,
    <SlideSpecs key="specs" device1={device1} device2={device2} variant={variant} />,
    <SlideFeature key="display" device1={device1} device2={device2} variant={variant} title="Tela" icon="📱" slideNumber={3}
      rows={[
        { label: "Tamanho", value1: device1.specs.display, value2: device2.specs.display },
        { label: "Tecnologia", value1: device1.specs.displayTech, value2: device2.specs.displayTech },
        { label: "Taxa de Atualização", value1: device1.specs.refreshRate, value2: device2.specs.refreshRate },
      ]} />,
    <SlideFeature key="proc" device1={device1} device2={device2} variant={variant} title="Processador" icon="⚡" slideNumber={4}
      rows={[
        { label: "Chipset", value1: device1.specs.chipset, value2: device2.specs.chipset },
        { label: "GPU", value1: device1.specs.gpu, value2: device2.specs.gpu },
        { label: "RAM", value1: device1.specs.ram, value2: device2.specs.ram, bar: true },
      ]} />,
    <SlideFeature key="cam" device1={device1} device2={device2} variant={variant} title="Câmeras" icon="📷" slideNumber={5}
      rows={[
        { label: "Câmera Principal", value1: device1.specs.mainCamera, value2: device2.specs.mainCamera, bar: true },
        { label: "Câmera Frontal", value1: device1.specs.frontCamera, value2: device2.specs.frontCamera, bar: true },
      ]} />,
    <SlideFeature key="bat" device1={device1} device2={device2} variant={variant} title="Bateria" icon="🔋" slideNumber={6}
      rows={[
        { label: "Capacidade", value1: device1.specs.battery, value2: device2.specs.battery, bar: true },
        { label: "Carregamento", value1: device1.specs.charging, value2: device2.specs.charging },
      ]} />,
    <SlidePrice key="price" device1={device1} device2={device2} variant={variant}
      price1={prices.p1} price2={prices.p2}
      onPrice1Change={(v) => setPrices(p => ({ ...p, p1: v }))}
      onPrice2Change={(v) => setPrices(p => ({ ...p, p2: v }))} />,
    <SlideWinner key="winner" device1={device1} device2={device2} variant={variant} winner={winner} />,
  ];

  async function exportSlides(format: "png" | "jpg" | "zip") {
    setExporting(true);
    await new Promise(r => setTimeout(r, 120));
    try {
      const canvases: { canvas: HTMLCanvasElement; name: string }[] = [];
      for (let i = 0; i < slidesRef.current.length; i++) {
        const el = slidesRef.current[i];
        if (!el) continue;
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null });
        canvases.push({ canvas, name: `slide-${String(i + 1).padStart(2, "0")}-${SLIDE_LABELS[i].toLowerCase()}` });
      }
      if (format === "zip") {
        const zip = new JSZip();
        for (const { canvas, name } of canvases) {
          const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), "image/png"));
          zip.file(`${name}.png`, blob);
        }
        download(await zip.generateAsync({ type: "blob" }), "compare-studio-slides.zip", "application/zip");
      } else {
        for (const { canvas, name } of canvases) {
          const mime = format === "jpg" ? "image/jpeg" : "image/png";
          canvas.toBlob(blob => { if (blob) download(blob, `${name}.${format}`, mime); }, mime, 0.95);
        }
      }
    } finally {
      setExporting(false);
    }
  }

  function download(blob: Blob, filename: string, type: string) {
    const url = URL.createObjectURL(new Blob([blob], { type }));
    const a = Object.assign(document.createElement("a"), { href: url, download: filename });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Slide counter + dots */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-black tabular-nums" style={{ color: variant.accent1 }}>
            {String(current + 1).padStart(2, "0")}
            <span className="opacity-30 font-normal"> / {slides.length}</span>
          </span>
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === current ? 20 : 6,
                  height: 6,
                  background: i === current ? variant.accent1 : `${variant.accent1}30`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onVariantChange}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
            style={{ background: `${variant.accent1}15`, color: variant.accent1, border: `1px solid ${variant.accent1}30` }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" />
            </svg>
            Novo Tema
          </button>

          <div className="flex items-center rounded-xl overflow-hidden"
            style={{ border: `1px solid ${variant.accent1}25` }}>
            {(["PNG", "JPG", "ZIP"] as const).map((fmt, i) => (
              <button
                key={fmt}
                onClick={() => exportSlides(fmt.toLowerCase() as "png" | "jpg" | "zip")}
                disabled={exporting}
                className="px-3 py-2 text-xs font-bold transition-all disabled:opacity-40"
                style={{
                  background: i === 0 ? variant.accent1 : "transparent",
                  color: i === 0 ? "#000" : variant.accent1,
                  borderLeft: i > 0 ? `1px solid ${variant.accent1}25` : "none",
                }}
              >
                {exporting && i === 0 ? (
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
                  </span>
                ) : fmt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main slide */}
      <div className="rounded-2xl overflow-hidden mx-auto shadow-2xl"
        style={{
          width: SLIDE_SIZE,
          height: SLIDE_SIZE,
          maxWidth: "100%",
          boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px rgba(0,0,0,0.6)`,
        }}>
        <div ref={el => { slidesRef.current[current] = el; }} style={{ width: SLIDE_SIZE, height: SLIDE_SIZE }}>
          {slides[current]}
        </div>
      </div>

      {/* Hidden slides for export */}
      <div style={{ position: "fixed", top: -9999, left: -9999, opacity: 0, pointerEvents: "none" }}>
        {slides.map((slide, i) =>
          i !== current ? (
            <div key={i} ref={el => { slidesRef.current[i] = el; }} style={{ width: SLIDE_SIZE, height: SLIDE_SIZE }}>
              {slide}
            </div>
          ) : null
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="flex-none flex flex-col items-center gap-1.5 transition-all duration-200"
          >
            <div
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                outline: i === current ? `2px solid ${variant.accent1}` : "2px solid transparent",
                outlineOffset: "2px",
                opacity: i === current ? 1 : 0.45,
                transform: i === current ? "scale(1.05)" : "scale(1)",
              }}
            >
              <div style={{
                width: SLIDE_SIZE,
                height: SLIDE_SIZE,
                transform: `scale(${THUMB_SCALE})`,
                transformOrigin: "top left",
                pointerEvents: "none",
              }}>
                {slide}
              </div>
            </div>
            <span
              className="text-[9px] font-bold uppercase tracking-wider"
              style={{ color: i === current ? variant.accent1 : "rgba(255,255,255,0.2)" }}
            >
              {SLIDE_LABELS[i]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
