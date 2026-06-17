export interface DeviceSpec {
  id: string;
  name: string;
  brand: string;
  image: string;
  specs: {
    display: string;
    displayTech: string;
    refreshRate: string;
    chipset: string;
    gpu: string;
    ram: string;
    storage: string;
    mainCamera: string;
    frontCamera: string;
    battery: string;
    charging: string;
    os: string;
    year: string;
    weight: string;
    dimensions: string;
  };
  raw: Record<string, string>;
}

export interface ComparisonData {
  device1: DeviceSpec;
  device2: DeviceSpec;
  winner: WinnerAnalysis;
  prices: { device1: string; device2: string };
}

export interface WinnerAnalysis {
  performance: string;
  camera: string;
  display: string;
  battery: string;
  value: string;
  overall: string;
  overallReason: string;
}

export interface DesignVariant {
  bg: string;
  accent1: string;
  accent2: string;
  card: string;
  text: string;
  style: string;
}

export type SlideType = "cover" | "specs" | "display" | "processor" | "camera" | "battery" | "price" | "winner";

export interface SearchResult {
  id: string;
  name: string;
  img: string;
}
