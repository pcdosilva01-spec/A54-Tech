"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import type { SearchResult } from "@/types";

interface Props {
  label: string;
  number: 1 | 2;
  accentColor: string;
  onSelect: (device: SearchResult) => void;
  selected?: SearchResult | null;
}

export default function DeviceSearch({ label, accentColor, onSelect, selected }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search-local?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(query), 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, search]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(device: SearchResult) {
    onSelect(device);
    setQuery(device.name);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      <label className="text-sm font-medium" style={{ color: accentColor }}>
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar dispositivo..."
          className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-600 transition-colors"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-50">
            Buscando...
          </span>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelect(r)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-800 transition-colors"
            >
              {r.img && (
                <img src={r.img} alt={r.name} className="w-8 h-10 object-contain" />
              )}
              <span className="text-sm">{r.name}</span>
            </button>
          ))}
        </div>
      )}

      {selected?.id && (
        <div className="text-xs text-zinc-500">
          Selecionado: {selected.name}
        </div>
      )}
    </div>
  );
}
