import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenSpec(key: string, value: string): string {
  if (!value || value === "N/A") return "N/A";

  const k = key.toLowerCase();

  if (k.includes("display") || k.includes("screen") || k.includes("tela")) {
    const amoled = /amoled/i.test(value) ? "AMOLED" : /oled/i.test(value) ? "OLED" : /ips/i.test(value) ? "IPS LCD" : "LCD";
    const hz = value.match(/(\d+)\s*hz/i)?.[1];
    return hz ? `${amoled} ${hz}Hz` : amoled;
  }
  if (k.includes("chipset") || k.includes("processor") || k.includes("cpu")) {
    return value.replace(/\s*\(.*?\)/g, "").replace("Qualcomm ", "").replace("Apple ", "").trim();
  }
  if (k.includes("battery")) {
    const m = value.match(/(\d+)\s*mah/i);
    return m ? `${m[1]} mAh` : value.split(",")[0].trim();
  }
  if (k.includes("charging")) {
    const m = value.match(/(\d+)\s*w/i);
    return m ? `${m[1]}W Fast Charge` : value.split(",")[0].trim();
  }
  if (k.includes("os") || k.includes("system")) {
    return value.split(";")[0].split(",")[0].trim();
  }
  if (k.includes("camera") || k.includes("cam")) {
    const m = value.match(/(\d+)\s*mp/i);
    return m ? `${m[1]}MP` : value.split(",")[0].trim();
  }
  if (k.includes("weight")) {
    return value.split("(")[0].trim();
  }

  return value.length > 22 ? value.split(",")[0].trim() : value;
}

export const DESIGN_VARIANTS = [
  { bg: "#0f0f1a", accent1: "#00d4ff", accent2: "#7c3aed", card: "#1a1a2e", text: "#ffffff", style: "cyber" },
  { bg: "#0a0a0a", accent1: "#f97316", accent2: "#ef4444", card: "#1a1a1a", text: "#ffffff", style: "fire" },
  { bg: "#f8fafc", accent1: "#3b82f6", accent2: "#1d4ed8", card: "#ffffff", text: "#0f172a", style: "clean" },
  { bg: "#0d1117", accent1: "#10b981", accent2: "#059669", card: "#161b22", text: "#e6edf3", style: "matrix" },
];
