import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadPaintingImage, getThumbnailUrl } from "@/lib/cloudinary/upload";
import { generateQRBuffer, getPaintingQRUrl } from "@/lib/qr/generate";
import { uploadQRCode } from "@/lib/cloudinary/upload";
import { createPaintingSchema } from "@/lib/validations/painting";
import { slugify } from "@/lib/helpers";

export async function POST(request: NextRequest) {
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

    if (!imageFile) {
      return NextResponse.json(
        { error: "Imagen requerida" },
        { status: 400 }
      );
    }

    // Validar datos
    const data = JSON.parse(dataString);
    const validationResult = createPaintingSchema.safeParse(data);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Datos inválidos" },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // Convertir imagen a buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    
    // Generar nombre único para la imagen
    const imageName = `${slugify(validData.name)}-${Date.now()}`;

    // Subir imagen a Cloudinary
    const uploadResult = await uploadPaintingImage(imageBuffer, imageName);

    // Generar thumbnail URL
    const thumbnailUrl = getThumbnailUrl(uploadResult.public_id, 400);

    // Crear registro en Supabase
    const supabase = createAdminClient();
    const insertData = {
      name: validData.name,
      description: validData.description || null,
      price: validData.price || null,
      width: validData.width || null,
      height: validData.height || null,
      depth: validData.depth || null,
      year: validData.year || null,
      category: validData.category || null,
      image_url: uploadResult.secure_url,
      cloudinary_public_id: uploadResult.public_id,
      thumbnail_url: thumbnailUrl,
    };
    const { data: painting, error } = await (supabase
      .from("paintings") as ReturnType<typeof supabase.from>)
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Error al guardar en la base de datos" },
        { status: 500 }
      );
    }

    // Generar código QR
    const paintingData = painting as { id: string; [key: string]: unknown };
    const qrUrl = getPaintingQRUrl(paintingData.id);
    const qrBuffer = await generateQRBuffer(qrUrl);
    const qrCodeUrl = await uploadQRCode(qrBuffer, paintingData.id);

    // Actualizar pintura con URL del QR
    await (supabase
      .from("paintings") as ReturnType<typeof supabase.from>)
      .update({ qr_code_url: qrCodeUrl })
      .eq("id", paintingData.id);

    return NextResponse.json({ 
      ...paintingData,
      qr_code_url: qrCodeUrl 
    });
  } catch (error) {
    console.error("Error creating painting:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
