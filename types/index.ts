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
  prices: { device1: string; device2: string };
}

export type SlideType = "cover" | "specs";

export interface SearchResult {
  id: string;
  name: string;
  img: string;
}