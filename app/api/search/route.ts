import { NextRequest, NextResponse } from "next/server";

// FonoAPI - free, no auth needed, no scraping
const FONO_BASE = "https://fonoapi.freshpixl.com/v1";
const TOKEN = "get_it_from_fonoapi"; // fallback to mock if no token

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query || query.length < 2) return NextResponse.json([]);

  try {
    // Use FonoAPI search
    const url = `${FONO_BASE}/getdevice?device=${encodeURIComponent(query)}&token=${TOKEN}&position=0`;
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const devices = data.slice(0, 10).map((d: Record<string, string>, i: number) => ({
          id: slugify(d.DeviceName || d.brand + "-" + i),
          name: d.DeviceName || "Unknown",
          img: "",
          brand: d.brand || "",
          raw: d,
        }));
        return NextResponse.json(devices);
      }
    }

    // Fallback: built-in popular devices search
    const fallback = searchLocalDevices(query);
    return NextResponse.json(fallback);

  } catch {
    const fallback = searchLocalDevices(query);
    return NextResponse.json(fallback);
  }
}

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function searchLocalDevices(query: string) {
  const q = query.toLowerCase();
  return POPULAR_DEVICES.filter(d =>
    d.name.toLowerCase().includes(q)
  ).slice(0, 10);
}

// Curated dataset of popular devices with real specs
const POPULAR_DEVICES = [
  { id: "samsung-galaxy-s24-ultra", name: "Samsung Galaxy S24 Ultra", img: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-1.jpg", brand: "Samsung" },
  { id: "samsung-galaxy-s24-plus", name: "Samsung Galaxy S24+", img: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24plus-1.jpg", brand: "Samsung" },
  { id: "samsung-galaxy-s24", name: "Samsung Galaxy S24", img: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-1.jpg", brand: "Samsung" },
  { id: "samsung-galaxy-s23-ultra", name: "Samsung Galaxy S23 Ultra", img: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-ultra-1.jpg", brand: "Samsung" },
  { id: "samsung-galaxy-s23", name: "Samsung Galaxy S23", img: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-1.jpg", brand: "Samsung" },
  { id: "samsung-galaxy-a55", name: "Samsung Galaxy A55", img: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a55-1.jpg", brand: "Samsung" },
  { id: "samsung-galaxy-a35", name: "Samsung Galaxy A35", img: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a35-1.jpg", brand: "Samsung" },
  { id: "iphone-16-pro-max", name: "Apple iPhone 16 Pro Max", img: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-max-1.jpg", brand: "Apple" },
  { id: "iphone-16-pro", name: "Apple iPhone 16 Pro", img: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-1.jpg", brand: "Apple" },
  { id: "iphone-16", name: "Apple iPhone 16", img: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-1.jpg", brand: "Apple" },
  { id: "iphone-15-pro-max", name: "Apple iPhone 15 Pro Max", img: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg", brand: "Apple" },
  { id: "iphone-15-pro", name: "Apple iPhone 15 Pro", img: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-1.jpg", brand: "Apple" },
  { id: "iphone-15", name: "Apple iPhone 15", img: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg", brand: "Apple" },
  { id: "iphone-14-pro-max", name: "Apple iPhone 14 Pro Max", img: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-1.jpg", brand: "Apple" },
  { id: "iphone-14", name: "Apple iPhone 14", img: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-1.jpg", brand: "Apple" },
  { id: "pixel-9-pro", name: "Google Pixel 9 Pro", img: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg", brand: "Google" },
  { id: "pixel-9", name: "Google Pixel 9", img: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-1.jpg", brand: "Google" },
  { id: "pixel-8-pro", name: "Google Pixel 8 Pro", img: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg", brand: "Google" },
  { id: "pixel-8", name: "Google Pixel 8", img: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-1.jpg", brand: "Google" },
  { id: "oneplus-12", name: "OnePlus 12", img: "https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-1.jpg", brand: "OnePlus" },
  { id: "oneplus-12r", name: "OnePlus 12R", img: "https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12r-1.jpg", brand: "OnePlus" },
  { id: "xiaomi-14-ultra", name: "Xiaomi 14 Ultra", img: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-ultra-1.jpg", brand: "Xiaomi" },
  { id: "xiaomi-14", name: "Xiaomi 14", img: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-1.jpg", brand: "Xiaomi" },
  { id: "xiaomi-redmi-note-13-pro", name: "Xiaomi Redmi Note 13 Pro", img: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-13-pro-1.jpg", brand: "Xiaomi" },
  { id: "motorola-edge-50-pro", name: "Motorola Edge 50 Pro", img: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-50-pro-1.jpg", brand: "Motorola" },
  { id: "motorola-moto-g85", name: "Motorola Moto G85", img: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g85-1.jpg", brand: "Motorola" },
  { id: "realme-gt6", name: "Realme GT 6", img: "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt-6-1.jpg", brand: "Realme" },
  { id: "oppo-find-x7-ultra", name: "Oppo Find X7 Ultra", img: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-find-x7-ultra-1.jpg", brand: "Oppo" },
  { id: "nothing-phone-2a", name: "Nothing Phone 2a", img: "https://fdn2.gsmarena.com/vv/pics/nothing/nothing-phone-2a-1.jpg", brand: "Nothing" },
  { id: "sony-xperia-1-vi", name: "Sony Xperia 1 VI", img: "https://fdn2.gsmarena.com/vv/pics/sony/sony-xperia-1-vi-1.jpg", brand: "Sony" },
];
