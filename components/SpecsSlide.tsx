"use client";

import Image from "next/image";
import type { DeviceSpec } from "@/types";

interface SpecsSlideProps {
  device1: DeviceSpec;
  device2: DeviceSpec;
  prices: { device1: string; device2: string };
  onPrev: () => void;
  onExport: () => void;
}

const specItems: Array<{ label: string; key: keyof DeviceSpec["specs"] }> = [
  { label: "Tela", key: "display" },
  { label: "RAM", key: "ram" },
  { label: "Processador", key: "chipset" },
  { label: "GPU", key: "gpu" },
  { label: "Câmeras", key: "mainCamera" },
  { label: "Vídeo", key: "charging" },
  { label: "Bateria", key: "battery" },
];

export default function SpecsSlide({ device1, device2, prices, onPrev, onExport }: SpecsSlideProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-20">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="grid-background" />
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-10">
        <span className="px-6 py-2 bg-primary rounded-full text-white text-base md:text-lg font-medium whitespace-nowrap">
          ESPECIFICAÇÕES
        </span>

        <div
          ref={(el) => { window.specsCardRef = el; }}
          data-export-target="true"
          className="w-full max-w-5xl bg-primary rounded-3xl p-8 md:p-12 overflow-hidden relative"
          role="region"
          aria-label="Especificações técnicas"
        >
          <div className="grid grid-cols-2 gap-8 md:gap-16 mb-12">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6">{device1.name}</h3>
              <ul className="space-y-4 text-left w-full max-w-xs mx-auto">
                {specItems.map(({ label, key }) => (
                  <li key={key} className="flex items-start gap-3 text-white text-base md:text-lg">
                    <span className="font-medium text-lg flex-shrink-0">•</span>
                    <span className="font-medium">{label}</span>
                    <span className="font-normal text-white/90 ml-auto text-right w-3/4 md:w-2/3 break-words">
                      {device1.specs[key]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-white/30 hidden md:block" aria-hidden="true" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6">{device2.name}</h3>
              <ul className="space-y-4 text-left w-full max-w-xs mx-auto">
                {specItems.map(({ label, key }) => (
                  <li key={key} className="flex items-start gap-3 text-white text-base md:text-lg">
                    <span className="font-medium text-lg flex-shrink-0">•</span>
                    <span className="font-medium">{label}</span>
                    <span className="font-normal text-white/90 ml-auto text-right w-3/4 md:w-2/3 break-words">
                      {device2.specs[key]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-end justify-between gap-8 relative z-10">
            <div className="flex-1 text-left min-w-0">
              <span className="font-serif text-4xl md:text-6xl font-bold text-white">
                {prices.device1}
              </span>
            </div>
            <div className="flex-1 text-right min-w-0">
              <span className="font-serif text-4xl md:text-6xl font-bold text-white">
                {prices.device2}
              </span>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[180px] md:h-[220px] pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="flex justify-between w-full h-full px-8">
              <div className="relative w-[35%] h-full">
                <Image
                  src={device1.image}
                  alt=""
                  fill
                  className="object-contain"
                  priority={false}
                  style={{ objectPosition: "top center" }}
                />
              </div>
              <div className="relative w-[35%] h-full">
                <Image
                  src={device2.image}
                  alt=""
                  fill
                  className="object-contain"
                  priority={false}
                  style={{ objectPosition: "top center" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={onPrev}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none focus:ring-4 focus:ring-white/30"
            aria-label="Slide anterior"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={onExport}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none focus:ring-4 focus:ring-white/30"
            aria-label="Exportar como imagem"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </button>

          <button
            onClick={onPrev}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none focus:ring-4 focus:ring-white/30"
            aria-label="Fechar"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    specsCardRef: HTMLDivElement | null;
  }
}