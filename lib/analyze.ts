import type { DeviceSpec, WinnerAnalysis } from "@/types";

function extractMHz(chipset: string): number {
  const tier: Record<string, number> = {
    "snapdragon 8 gen 3": 100, "snapdragon 8 gen 2": 90, "snapdragon 8 gen 1": 80,
    "a17": 98, "a16": 92, "a15": 86, "a14": 78,
    "dimensity 9300": 95, "dimensity 9200": 85, "dimensity 9000": 75,
    "exynos 2400": 88, "exynos 2300": 78,
    "snapdragon 7": 60, "snapdragon 6": 50,
  };
  const lower = chipset.toLowerCase();
  for (const [k, v] of Object.entries(tier)) {
    if (lower.includes(k)) return v;
  }
  return 50;
}

function extractMp(camera: string): number {
  const m = camera.match(/(\d+)\s*mp/i);
  return m ? parseInt(m[1]) : 0;
}

function extractMah(battery: string): number {
  const m = battery.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function extractInch(display: string): number {
  const m = display.match(/(\d+\.?\d*)\s*"/);
  return m ? parseFloat(m[1]) : 0;
}

export function analyzeWinner(d1: DeviceSpec, d2: DeviceSpec): WinnerAnalysis {
  const perf1 = extractMHz(d1.specs.chipset);
  const perf2 = extractMHz(d2.specs.chipset);
  const cam1 = extractMp(d1.specs.mainCamera);
  const cam2 = extractMp(d2.specs.mainCamera);
  const bat1 = extractMah(d1.specs.battery);
  const bat2 = extractMah(d2.specs.battery);
  const disp1 = extractInch(d1.specs.display);
  const disp2 = extractInch(d2.specs.display);

  const scores = { [d1.name]: 0, [d2.name]: 0 };

  const performance = perf1 >= perf2 ? d1.name : d2.name;
  scores[performance]++;

  const camera = cam1 >= cam2 ? d1.name : d2.name;
  scores[camera]++;

  const battery = bat1 >= bat2 ? d1.name : d2.name;
  scores[battery]++;

  const display = disp1 >= disp2 ? d1.name : d2.name;
  scores[display]++;

  const value = bat1 >= bat2 ? d1.name : d2.name;

  const overall = scores[d1.name] >= scores[d2.name] ? d1.name : d2.name;
  const loser = overall === d1.name ? d2.name : d1.name;

  return {
    performance,
    camera,
    display,
    battery,
    value,
    overall,
    overallReason: `${overall} vence em ${scores[overall]} de 4 categorias analisadas contra ${scores[loser]} do ${loser}.`,
  };
}
