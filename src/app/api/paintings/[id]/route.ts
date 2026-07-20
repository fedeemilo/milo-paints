import { NextRequest, NextResponse } from "next/server";
import {
  uploadPaintingImage,
  getThumbnailUrl,
  deleteImage,
  deleteQRCode,
} from "@/lib/cloudinary/upload";
import { updatePaintingSchema } from "@/lib/validations/painting";
import { slugify } from "@/lib/helpers";
import {
  getPaintingById,
  updatePainting,
  deletePainting,
} from "@/lib/mongodb/paintings";
import { requireAdminApi } from "@/lib/auth/require-admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const painting = await getPaintingById(id);

  if (!painting) {
    return NextResponse.json(
      { error: "Pintura no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(painting);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

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
    const currentPainting = await getPaintingById(id);

    if (!currentPainting) {
      return NextResponse.json(
        { error: "Pintura no encontrada" },
        { status: 404 }
      );
    }

    const updateData: Parameters<typeof updatePainting>[1] = {
      name: validData.name,
      description: validData.description || null,
      price: validData.price ?? null,
      width: validData.width ?? null,
      height: validData.height ?? null,
      depth: validData.depth ?? null,
      year: validData.year ?? null,
      category: validData.category || null,
    };

    if (imageFile) {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const imageName = `${slugify(validData.name || "painting")}-${Date.now()}`;

      const uploadResult = await uploadPaintingImage(imageBuffer, imageName);

      if (currentPainting.cloudinary_public_id) {
        await deleteImage(currentPainting.cloudinary_public_id).catch(
          console.error
        );
      }

      updateData.image_url = uploadResult.secure_url;
      updateData.cloudinary_public_id = uploadResult.public_id;
      updateData.thumbnail_url = getThumbnailUrl(uploadResult.public_id, 400);
    }

    const painting = await updatePainting(id, updateData);

    if (!painting) {
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

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const painting = await getPaintingById(id);

  if (!painting) {
    return NextResponse.json(
      { error: "Pintura no encontrada" },
      { status: 404 }
    );
  }

  const deleted = await deletePainting(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Error al eliminar" },
      { status: 500 }
    );
  }

  if (painting.cloudinary_public_id) {
    await deleteImage(painting.cloudinary_public_id).catch(console.error);
  }

  // Borrar también el QR en Cloudinary (si existía)
  await deleteQRCode(id).catch(console.error);

  return NextResponse.json({ success: true });
}
