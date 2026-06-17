import { NextRequest, NextResponse } from "next/server";
import { getDeviceById, deviceDatabase } from "@/lib/device-database";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const device = getDeviceById(id);
  
  if (!device) {
    return NextResponse.json({ 
      error: "Device not found in database",
      availableDevices: Object.keys(deviceDatabase)
    }, { status: 404 });
  }

  return NextResponse.json(device);
}
