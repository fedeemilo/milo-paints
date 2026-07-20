import { NextRequest, NextResponse } from "next/server";
import { uploadPaintingImage, getThumbnailUrl } from "@/lib/cloudinary/upload";
import { generateQRBuffer, getPaintingQRUrl } from "@/lib/qr/generate";
import { uploadQRCode } from "@/lib/cloudinary/upload";
import { createPaintingSchema } from "@/lib/validations/painting";
import { slugify } from "@/lib/helpers";
import { createPainting, updatePainting } from "@/lib/mongodb/paintings";
import { requireAdminApi } from "@/lib/auth/require-admin";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

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

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imageName = `${slugify(validData.name)}-${Date.now()}`;

    const uploadResult = await uploadPaintingImage(imageBuffer, imageName);
    const thumbnailUrl = getThumbnailUrl(uploadResult.public_id, 400);

    const painting = await createPainting({
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
    });

    const qrUrl = getPaintingQRUrl(painting.id);
    const qrBuffer = await generateQRBuffer(qrUrl);
    const qrCodeUrl = await uploadQRCode(qrBuffer, painting.id);

    await updatePainting(painting.id, { qr_code_url: qrCodeUrl });

    return NextResponse.json({
      ...painting,
      qr_code_url: qrCodeUrl,
    });
  } catch (error) {
    console.error("Error creating painting:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
