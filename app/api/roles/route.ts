import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { DEFAULT_PERMISSIONS } from "@/lib/permissions";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, color, permissions, hoist, mentionable, serverId } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || !serverId) {
      return new NextResponse("Name and Server ID are required", { status: 400 });
    }

    // Check if user is admin
    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });

    if (!server) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Get the highest position
    const roles = await db.role.findMany({
      where: { serverId },
      orderBy: { position: "desc" },
      take: 1,
    });

    const position = roles.length > 0 ? roles[0].position + 1 : 1; // 0 is reserved for @everyone

    const role = await db.role.create({
      data: {
        name,
        color: color || null,
        permissions: BigInt(permissions || DEFAULT_PERMISSIONS.toString()),
        hoist: hoist || false,
        mentionable: mentionable !== false, // Default true
        serverId,
        position,
      },
    });

    // Convert BigInt to string for JSON
    const roleResponse = {
      ...role,
      permissions: role.permissions.toString(),
    };

    return NextResponse.json(roleResponse);
  } catch (error) {
    console.log("[ROLES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }

    const roles = await db.role.findMany({
      where: { serverId },
      orderBy: { position: "asc" },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    // Convert BigInt to string for JSON
    const rolesResponse = roles.map(role => ({
      ...role,
      permissions: role.permissions.toString(),
    }));

    return NextResponse.json(rolesResponse);
  } catch (error) {
    console.log("[ROLES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


