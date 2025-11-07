import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, color, permissions, hoist, mentionable, position } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.roleId) {
      return new NextResponse("Role ID missing", { status: 400 });
    }

    // Find role and check permissions
    const role = await db.role.findUnique({
      where: { id: params.roleId },
      include: {
        server: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!role) {
      return new NextResponse("Role not found", { status: 404 });
    }

    // Check if user is admin
    const member = role.server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member || member.role !== MemberRole.ADMIN) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Cannot edit @everyone role (isDefault)
    if (role.isDefault) {
      return new NextResponse("Cannot edit @everyone role", { status: 400 });
    }

    const updatedRole = await db.role.update({
      where: { id: params.roleId },
      data: {
        ...(name && { name }),
        ...(color !== undefined && { color }),
        ...(permissions !== undefined && { permissions: BigInt(permissions) }),
        ...(hoist !== undefined && { hoist }),
        ...(mentionable !== undefined && { mentionable }),
        ...(position !== undefined && { position }),
      },
    });

    const roleResponse = {
      ...updatedRole,
      permissions: updatedRole.permissions.toString(),
    };

    return NextResponse.json(roleResponse);
  } catch (error) {
    console.log("[ROLE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.roleId) {
      return new NextResponse("Role ID missing", { status: 400 });
    }

    // Find role and check permissions
    const role = await db.role.findUnique({
      where: { id: params.roleId },
      include: {
        server: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!role) {
      return new NextResponse("Role not found", { status: 404 });
    }

    // Check if user is admin
    const member = role.server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member || member.role !== MemberRole.ADMIN) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Cannot delete @everyone role
    if (role.isDefault) {
      return new NextResponse("Cannot delete @everyone role", { status: 400 });
    }

    // Delete role
    await db.role.delete({
      where: { id: params.roleId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[ROLE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


