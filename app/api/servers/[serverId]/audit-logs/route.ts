import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user has permission to view audit logs (admin/mod)
    const server = await db.server.findFirst({
      where: {
        id: params.serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
    });

    if (!server) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const where: any = {
      serverId: params.serverId,
    };

    if (action) {
      where.action = action;
    }

    if (userId) {
      where.userId = userId;
    }

    const logs = await db.auditLog.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.log("[AUDIT_LOGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


