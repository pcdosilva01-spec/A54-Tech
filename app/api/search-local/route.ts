import { NextRequest, NextResponse } from "next/server";
import { searchDevices, getAllDevices } from "@/lib/device-database";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  
  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const results = searchDevices(query);
  return NextResponse.json(results.map(d => ({
    id: d.id,
    name: d.name,
    img: d.image,
    brand: d.brand,
  })));
}

export async function POST() {
  const all = getAllDevices();
  return NextResponse.json(all.map(d => ({
    id: d.id,
    name: d.name,
    img: d.image,
    brand: d.brand,
  })));
}
