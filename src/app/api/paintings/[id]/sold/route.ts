import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

type PaintingSoldData = {
  id: string;
  sold: boolean;
};

type PaintingUpdateResult = {
  sold: boolean;
  sold_at: string | null;
};

// PATCH - Toggle sold status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    console.log("[SOLD TOGGLE] ID recibido:", id);
    
    const supabase = createAdminClient();

    // Primero verificar que la pintura existe
    const { data: painting, error: fetchError } = await supabase
      .from("paintings")
      .select("id, sold")
      .eq("id", id)
      .single();

    console.log("[SOLD TOGGLE] Resultado fetch:", { painting, fetchError });

    if (fetchError) {
      console.error("[SOLD TOGGLE] Error al buscar:", fetchError);
      return NextResponse.json(
        { error: "Pintura no encontrada", details: fetchError.message },
        { status: 404 }
      );
    }

    if (!painting) {
      console.error("[SOLD TOGGLE] Pintura no existe con ID:", id);
      return NextResponse.json(
        { error: "Pintura no encontrada" },
        { status: 404 }
      );
    }

    // Type assertion después de validar que existe
    const paintingData = painting as PaintingSoldData;
    const newSold = !paintingData.sold;
    console.log("[SOLD TOGGLE] Cambiando sold de", paintingData.sold, "a", newSold);

    // Actualizar directamente sin type casting
    const { error: updateError } = await (supabase
      .from("paintings")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update as any)({
        sold: newSold,
        sold_at: newSold ? new Date().toISOString() : null,
      })
      .eq("id", id);

    if (updateError) {
      console.error("[SOLD TOGGLE] Error al actualizar:", updateError);
      return NextResponse.json(
        { error: "Error al actualizar", details: updateError.message },
        { status: 500 }
      );
    }

    // Obtener los datos actualizados
    const { data: updated, error: selectError } = await supabase
      .from("paintings")
      .select("sold, sold_at")
      .eq("id", id)
      .single();

    console.log("[SOLD TOGGLE] Resultado update:", { updated, selectError });

    if (selectError || !updated) {
      console.error("[SOLD TOGGLE] Error al obtener datos actualizados:", selectError);
      return NextResponse.json(
        { error: "Error al obtener datos actualizados" },
        { status: 500 }
      );
    }

    // Type assertion para el resultado
    const updatedData = updated as PaintingUpdateResult;

    return NextResponse.json({
      success: true,
      sold: updatedData.sold,
      sold_at: updatedData.sold_at,
    });
  } catch (error) {
    console.error("[SOLD TOGGLE] Error general:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: String(error) },
      { status: 500 }
    );
  }
}
