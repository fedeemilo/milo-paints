import { NextRequest, NextResponse } from "next/server";
import { togglePaintingSold } from "@/lib/mongodb/paintings";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const updated = await togglePaintingSold(id);

    if (!updated) {
      return NextResponse.json(
        { error: "Pintura no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      sold: updated.sold,
      sold_at: updated.sold_at,
    });
  } catch (error) {
    console.error("[SOLD TOGGLE] Error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: String(error) },
      { status: 500 }
    );
  }
}
