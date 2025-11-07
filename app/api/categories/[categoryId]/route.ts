import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, position } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category ID missing", { status: 400 });
    }

    // Find category and check permissions
    const category = await db.category.findUnique({
      where: { id: params.categoryId },
      include: {
        server: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const member = category.server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member || (member.role !== MemberRole.ADMIN && member.role !== MemberRole.MODERATOR)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedCategory = await db.category.update({
      where: { id: params.categoryId },
      data: {
        ...(name && { name }),
        ...(position !== undefined && { position }),
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category ID missing", { status: 400 });
    }

    // Find category and check permissions
    const category = await db.category.findUnique({
      where: { id: params.categoryId },
      include: {
        server: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const member = category.server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member || (member.role !== MemberRole.ADMIN && member.role !== MemberRole.MODERATOR)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Delete category (channels will have categoryId set to null due to SetNull)
    await db.category.delete({
      where: { id: params.categoryId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}




