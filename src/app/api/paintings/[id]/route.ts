import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadPaintingImage, getThumbnailUrl, deleteImage } from "@/lib/cloudinary/upload";
import { updatePaintingSchema } from "@/lib/validations/painting";
import { slugify } from "@/lib/helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Obtener una pintura
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: painting, error } = await supabase
    .from("paintings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !painting) {
    return NextResponse.json(
      { error: "Pintura no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(painting);
}

// PUT - Actualizar una pintura
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  
  try {
    const formData = await request.formData();
    const dataString = formData.get("data") as string;
    const imageFile = formData.get("image") as File | null;

    if (!dataString) {
      return NextResponse.json(
        { error: "Datos requeridos" },
        { status: 400 }
      );
    }

    // Validar datos
    const data = JSON.parse(dataString);
    const validationResult = updatePaintingSchema.safeParse(data);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Datos inválidos" },
        { status: 400 }
      );
    }

    const validData = validationResult.data;
    const supabase = createAdminClient();

    // Obtener pintura actual
    const { data: currentPainting } = await supabase
      .from("paintings")
      .select("cloudinary_public_id")
      .eq("id", id)
      .single();

    if (!currentPainting) {
      return NextResponse.json(
        { error: "Pintura no encontrada" },
        { status: 404 }
      );
    }

    const currentPaintingData = currentPainting as { cloudinary_public_id: string | null };

    const updateData: Record<string, unknown> = {
      name: validData.name,
      description: validData.description || null,
      price: validData.price || null,
      width: validData.width || null,
      height: validData.height || null,
      depth: validData.depth || null,
      year: validData.year || null,
      category: validData.category || null,
    };

    // Si hay nueva imagen, subirla
    if (imageFile) {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const imageName = `${slugify(validData.name || "painting")}-${Date.now()}`;

      // Subir nueva imagen
      const uploadResult = await uploadPaintingImage(imageBuffer, imageName);
      
      // Eliminar imagen anterior
      if (currentPaintingData.cloudinary_public_id) {
        await deleteImage(currentPaintingData.cloudinary_public_id).catch(console.error);
      }

      updateData.image_url = uploadResult.secure_url;
      updateData.cloudinary_public_id = uploadResult.public_id;
      updateData.thumbnail_url = getThumbnailUrl(uploadResult.public_id, 400);
    }

    // Actualizar en Supabase
    const { data: painting, error } = await (supabase
      .from("paintings") as ReturnType<typeof supabase.from>)
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Error al actualizar" },
        { status: 500 }
      );
    }

    return NextResponse.json(painting);
  } catch (error) {
    console.error("Error updating painting:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una pintura
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Obtener pintura para eliminar imagen de Cloudinary
  const { data: painting } = await supabase
    .from("paintings")
    .select("cloudinary_public_id")
    .eq("id", id)
    .single();

  if (!painting) {
    return NextResponse.json(
      { error: "Pintura no encontrada" },
      { status: 404 }
    );
  }

  const paintingData = painting as { cloudinary_public_id: string | null };

  // Eliminar de Supabase
  const { error } = await supabase
    .from("paintings")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Error al eliminar" },
      { status: 500 }
    );
  }

  // Eliminar imagen de Cloudinary
  if (paintingData.cloudinary_public_id) {
    await deleteImage(paintingData.cloudinary_public_id).catch(console.error);
  }

  return NextResponse.json({ success: true });
}
