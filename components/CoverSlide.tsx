"use client";

import { DeviceSpec } from "@/types";

interface CoverSlideProps {
  device1: DeviceSpec | null;
  device2: DeviceSpec | null;
  onNext: () => void;
}

export default function CoverSlide({ device1, device2, onNext }: CoverSlideProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="grid-background fixed inset-0 z-0" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 pt-8">
          <h1 className="text-primary font-bold text-5xl md:text-7xl tracking-tight text-center">
            COMPARATIVO
          </h1>
          <span className="bg-primary text-gray-900 text-base md:text-lg px-6 py-2 rounded-full font-medium">
            Qual o melhor Galaxy?
          </span>
        </div>

        <div className="flex items-center justify-center gap-8 md:gap-16 w-full max-w-5xl">
          <div className="flex flex-col items-center gap-4 flex-1 max-w-[35%]">
            {device1 ? (
              <img
                src={device1.image}
                alt={device1.name}
                className="w-full h-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-gray-100 rounded-xl flex items-center justify-center" />
            )}
            <span className="bg-primary text-gray-900 text-lg md:text-xl px-6 py-3 rounded-full font-medium text-center w-full">
              {device1?.name || "Selecione um aparelho"}
            </span>
          </div>

          <div className="text-primary font-bold text-4xl md:text-6xl flex-shrink-0">
            VS
          </div>

          <div className="flex flex-col items-center gap-4 flex-1 max-w-[35%]">
            {device2 ? (
              <img
                src={device2.image}
                alt={device2.name}
                className="w-full h-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-gray-100 rounded-xl flex items-center justify-center" />
            )}
            <span className="bg-primary text-gray-900 text-lg md:text-xl px-6 py-3 rounded-full font-medium text-center w-full">
              {device2?.name || "Selecione um aparelho"}
            </span>
          </div>
        </div>

        <button
          onClick={onNext}
          className="mt-auto mb-8 w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:bg-primary-hover transition-colors shadow-lg"
          aria-label="Próximo slide"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 15l-6-6-6 6" />
            <path d="M12 3v12" />
          </svg>
        </button>
      </div>
    </div>
  );
}