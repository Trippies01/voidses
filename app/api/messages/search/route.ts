import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query");
    const serverId = searchParams.get("serverId");
    const channelId = searchParams.get("channelId");
    const memberId = searchParams.get("memberId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!query || query.trim().length === 0) {
      return new NextResponse("Search query missing", { status: 400 });
    }

    // Verify user is member of the server
    const member = await db.member.findFirst({
      where: {
        serverId: serverId,
        profileId: profile.id,
      },
    });

    if (!member) {
      return new NextResponse("Not a member", { status: 403 });
    }

    // Build search query
    const whereClause: any = {
      channel: {
        serverId: serverId,
      },
      deleted: false,
      content: {
        contains: query,
        mode: "insensitive",
      },
    };

    // Filter by channel if provided
    if (channelId) {
      whereClause.channelId = channelId;
    }

    // Filter by member if provided
    if (memberId) {
      whereClause.memberId = memberId;
    }

    const messages = await db.message.findMany({
      where: whereClause,
      include: {
        member: {
          include: {
            profile: true,
          },
        },
        channel: true,
        reactions: {
          include: {
            member: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit results
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.log("[MESSAGE_SEARCH_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

