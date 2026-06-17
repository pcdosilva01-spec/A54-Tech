"use client";

import { useState, useRef, useCallback } from "react";
import CoverSlide from "./CoverSlide";
import SpecsSlide from "./SpecsSlide";
import ExportButton from "./ExportButton";
import type { ComparisonData } from "@/types";

interface SlideCarouselProps {
  comparison: ComparisonData;
}

export default function SlideCarousel({ comparison }: SlideCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState<0 | 1>(0);
  const specsCardRef = useRef<HTMLDivElement>(null);

  const goToNext = useCallback(() => {
    setCurrentSlide(1);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentSlide(0);
  }, []);

  const handleExport = useCallback(async () => {
    if (!specsCardRef.current) return;

    const html2canvas = (await import("html2canvas")).default;

    try {
      const canvas = await html2canvas(specsCardRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFFFF",
        onclone: (clonedDoc) => {
          const clonedCard = clonedDoc.querySelector("[data-export-target]");
          if (clonedCard) {
            (clonedCard as HTMLElement).style.transform = "none";
            (clonedCard as HTMLElement).style.transformOrigin = "top left";
            (clonedCard as HTMLElement).style.width = `${specsCardRef.current?.offsetWidth}px`;
            (clonedCard as HTMLElement).style.height = `${specsCardRef.current?.offsetHeight}px`;
          }
        },
      });

      const link = document.createElement("a");
      link.download = "comparativo-galaxy-especificacoes.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Erro ao exportar:", error);
    }
  }, []);

  const { device1, device2, prices } = comparison;

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {currentSlide === 0 && (
        <CoverSlide
          device1={device1}
          device2={device2}
          onNext={goToNext}
        />
      )}

      {currentSlide === 1 && (
        <SpecsSlide
          device1={device1}
          device2={device2}
          prices={prices}
          onPrev={goToPrev}
          onExport={handleExport}
        />
      )}
    </div>
  );
}