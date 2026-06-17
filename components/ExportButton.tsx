"use client";

import { useCallback } from "react";

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
}

export default function ExportButton({ targetRef, fileName = "comparativo" }: ExportButtonProps) {
  const handleExport = useCallback(async () => {
    if (!targetRef.current) {
      console.error("Elemento alvo não encontrado para exportação");
      return;
    }

    try {
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(targetRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFFFF",
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector("[data-export-target]");
          if (clonedElement) {
            (clonedElement as HTMLElement).style.transform = "none";
            (clonedElement as HTMLElement).style.transformOrigin = "top left";
          }
        },
      });

      const link = document.createElement("a");
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    }
  }, [targetRef, fileName]);

  return (
    <button
      onClick={handleExport}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:bg-primary-hover transition-colors shadow-lg"
      aria-label="Exportar como imagem"
      title="Exportar como imagem"
      type="button"
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
  );
}