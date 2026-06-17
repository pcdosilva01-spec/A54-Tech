"use client";

import { useState, useEffect, Suspense } from "react";
import SlideCarousel from "@/components/SlideCarousel";
import type { DeviceSpec, ComparisonData, SearchResult } from "@/types";

const POPULAR_DEVICES: SearchResult[] = [
  { id: "samsung-galaxy-s24-ultra", name: "Galaxy S24 Ultra", img: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra.jpg" },
  { id: "samsung-galaxy-s24-plus", name: "Galaxy S24+", img: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-plus.jpg" },
  { id: "samsung-galaxy-s24", name: "Galaxy S24", img: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24.jpg" },
  { id: "samsung-galaxy-s23-ultra", name: "Galaxy S23 Ultra", img: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra.jpg" },
  { id: "samsung-galaxy-s23-plus", name: "Galaxy S23+", img: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-plus.jpg" },
  { id: "samsung-galaxy-s23", name: "Galaxy S23", img: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23.jpg" },
  { id: "samsung-galaxy-s22-ultra", name: "Galaxy S22 Ultra", img: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-ultra.jpg" },
  { id: "samsung-galaxy-z-fold5", name: "Galaxy Z Fold 5", img: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold-5.jpg" },
  { id: "samsung-galaxy-z-flip5", name: "Galaxy Z Flip 5", img: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip-5.jpg" },
  { id: "samsung-galaxy-a55", name: "Galaxy A55", img: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a55.jpg" },
  { id: "samsung-galaxy-a35", name: "Galaxy A35", img: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a35.jpg" },
  { id: "samsung-galaxy-a15", name: "Galaxy A15", img: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a15.jpg" },
];

async function fetchDevice(id: string): Promise<DeviceSpec | null> {
  try {
    const res = await fetch(`/api/device-local/${id}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function searchDevices(query: string): Promise<SearchResult[]> {
  try {
    const res = await fetch(`/api/search-local?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function getPlaceholderImage(name: string) {
  const encodedName = encodeURIComponent(name);
  return `https://via.placeholder.com/400x800/0057D8/FFFFFF?text=${encodedName}`;
}

function DeviceSelector({
  label,
  device,
  onSearch,
  onSelect,
  onClear,
}: {
  label: string;
  device: DeviceSpec | null;
  onSearch: (query: string) => void;
  onSelect: (device: DeviceSpec) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults(POPULAR_DEVICES);
      return;
    }
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      const data = await searchDevices(query);
      setResults(data.length > 0 ? data : POPULAR_DEVICES);
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = async (selected: SearchResult) => {
    setIsLoading(true);
    const deviceData = await fetchDevice(selected.id);
    if (deviceData) onSelect(deviceData);
    setQuery("");
    setShowResults(false);
    setIsLoading(false);
  };

  if (device) {
    return (
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <div className="relative w-full aspect-[9/19] max-w-xs bg-white/5 rounded-2xl overflow-hidden border border-white/10">
          <img
            src={device.image}
            alt={device.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold text-white text-center">{device.name}</h3>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
        >
          Trocar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
            onSearch(e.target.value);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Digite o modelo..."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-white/50">Buscando...</div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-white/50">Nenhum dispositivo encontrado</div>
            ) : (
              <ul className="py-2">
                {results.map((result) => (
                  <li
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className="px-4 py-3 hover:bg-white/10 flex items-center gap-3 cursor-pointer transition-colors"
                  >
                    <img
                      src={result.img}
                      alt={result.name}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => { e.currentTarget.src = getPlaceholderImage(result.name); }}
                    />
                    <span className="text-white font-medium">{result.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [device1, setDevice1] = useState<DeviceSpec | null>(null);
  const [device2, setDevice2] = useState<DeviceSpec | null>(null);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [showCarousel, setShowCarousel] = useState(false);

  const handleSelectDevice1 = (device: DeviceSpec) => {
    setDevice1(device);
    if (device2 && device.id !== device2.id) {
      buildComparison(device, device2);
    }
  };

  const handleSelectDevice2 = (device: DeviceSpec) => {
    setDevice2(device);
    if (device1 && device.id !== device1.id) {
      buildComparison(device1, device);
    }
  };

  const buildComparison = (d1: DeviceSpec, d2: DeviceSpec) => {
    const prices = {
      device1: d1.specs.storage.includes("1TB") ? "R$ 7.999" :
               d1.specs.storage.includes("512GB") ? "R$ 6.999" : "R$ 5.999",
      device2: d2.specs.storage.includes("1TB") ? "R$ 7.999" :
               d2.specs.storage.includes("512GB") ? "R$ 6.999" : "R$ 5.999",
    };
    setComparison({ device1: d1, device2: d2, prices });
    setShowCarousel(true);
  };

  const clearDevice1 = () => {
    setDevice1(null);
    setComparison(null);
    setShowCarousel(false);
  };

  const clearDevice2 = () => {
    setDevice2(null);
    setComparison(null);
    setShowCarousel(false);
  };

  return (
    <div className="min-h-screen relative">
      <div className="grid-background fixed inset-0 z-0" aria-hidden="true" />

      <main className="relative z-10 min-h-screen flex flex-col">
        {!showCarousel ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary tracking-tight text-center mb-6">
              COMPARATIVO
            </h1>
            <p className="text-xl md:text-2xl text-white/70 text-center mb-16 max-w-2xl">
              Escolha dois smartphones Galaxy para comparar lado a lado
            </p>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <DeviceSelector
                label="Primeiro aparelho"
                device={device1}
                onSearch={() => {}}
                onSelect={handleSelectDevice1}
                onClear={clearDevice1}
              />
              <DeviceSelector
                label="Segundo aparelho"
                device={device2}
                onSearch={() => {}}
                onSelect={handleSelectDevice2}
                onClear={clearDevice2}
              />
            </div>

            {(device1 && device2) && (
              <button
                onClick={() => setShowCarousel(true)}
                className="mt-12 px-10 py-4 bg-primary hover:bg-primary-hover rounded-full text-white text-lg font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30"
              >
                Comparar Agora
              </button>
            )}
          </div>
        ) : (
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-white/50 text-lg">Carregando...</div></div>}>
            <SlideCarousel comparison={comparison!} />
          </Suspense>
        )}
      </main>
    </div>
  );
}