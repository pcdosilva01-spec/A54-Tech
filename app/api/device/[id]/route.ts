import { NextRequest, NextResponse } from "next/server";
import { shortenSpec } from "@/lib/utils";
import type { DeviceSpec } from "@/types";

function extractSpec(raw: Record<string, string>, ...keys: string[]): string {
  for (const k of keys) {
    const found = Object.entries(raw).find(([key]) =>
      key.toLowerCase().includes(k.toLowerCase())
    );
    if (found?.[1]?.trim()) return found[1].trim();
  }
  return "N/A";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const axios = require("axios");
    axios.defaults.headers.common["User-Agent"] =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { catalog } = require("gsmarena-api");
    const device = await catalog.getDevice(id);

    if (!device) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const raw: Record<string, string> = {};

    if (device.detailSpec) {
      for (const section of device.detailSpec) {
        for (const item of section.specifications || []) {
          if (item.name?.trim() && item.value?.trim()) {
            raw[item.name.trim()] = item.value.trim();
          }
        }
      }
    }

    if (device.quickSpec) {
      for (const item of device.quickSpec) {
        if (item.name?.trim() && item.value?.trim()) {
          raw[`quick_${item.name.trim()}`] = item.value.trim();
        }
      }
    }

    const name: string = device.name || id;
    const brand = name.split(" ")[0];

    const spec: DeviceSpec = {
      id,
      name,
      brand,
      image: device.img || "",
      specs: {
        display: shortenSpec("display", extractSpec(raw, "Size")),
        displayTech: shortenSpec("display", extractSpec(raw, "Type")),
        refreshRate: extractSpec(raw, "refresh rate"),
        chipset: shortenSpec("chipset", extractSpec(raw, "Chipset")),
        gpu: shortenSpec("gpu", extractSpec(raw, "GPU")),
        ram: shortenSpec("ram", extractSpec(raw, "Internal")),
        storage: shortenSpec("storage", extractSpec(raw, "Internal")),
        mainCamera: shortenSpec("camera", extractSpec(raw, "Main Camera", "Triple", "Quad", "Single", "Double", "quick_Camera pixels")),
        frontCamera: shortenSpec("camera", extractSpec(raw, "Selfie camera", "Front camera")),
        battery: shortenSpec("battery", extractSpec(raw, "Capacity", "quick_Battery size")),
        charging: shortenSpec("charging", extractSpec(raw, "Charging")),
        os: shortenSpec("os", extractSpec(raw, "OS")),
        year: extractSpec(raw, "Announced"),
        weight: shortenSpec("weight", extractSpec(raw, "Weight")),
        dimensions: extractSpec(raw, "Dimensions"),
      },
      raw,
    };

    return NextResponse.json(spec);
  } catch (err) {
    console.error("Device fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch device" }, { status: 500 });
  }
}
