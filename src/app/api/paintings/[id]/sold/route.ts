import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH - Toggle sold status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createAdminClient();

  try {
    // Obtener estado actual
    const { data: painting, error: fetchError } = await supabase
      .from("paintings")
      .select("sold")
      .eq("id", id)
      .single();

    if (fetchError || !painting) {
      return NextResponse.json(
        { error: "Pintura no encontrada" },
        { status: 404 }
      );
    }

    const currentSold = (painting as { sold: boolean }).sold;
    const newSold = !currentSold;

    // Actualizar estado
    const updateData = {
      sold: newSold,
      sold_at: newSold ? new Date().toISOString() : null,
    };

    const { error: updateError } = await (supabase
      .from("paintings") as ReturnType<typeof supabase.from>)
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      console.error("Supabase error:", updateError);
      return NextResponse.json(
        { error: "Error al actualizar" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      sold: newSold,
      sold_at: updateData.sold_at,
    });
  } catch (error) {
    console.error("Error toggling sold status:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
