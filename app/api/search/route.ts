import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    
    const query = searchParams.get("q");
    const channelId = searchParams.get("channelId");
    const serverId = searchParams.get("serverId");
    const from = searchParams.get("from"); // username filter
    const has = searchParams.get("has"); // "file", "link", "embed"
    const before = searchParams.get("before"); // date
    const after = searchParams.get("after"); // date

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!query || query.length < 2) {
      return new NextResponse("Query too short", { status: 400 });
    }

    // Build where clause
    const where: any = {
      deleted: false,
      content: {
        contains: query,
        mode: "insensitive",
      },
    };

    // Channel filter
    if (channelId) {
      where.channelId = channelId;
    }

    // Server filter (search across all server channels)
    if (serverId && !channelId) {
      where.channel = {
        serverId,
      };
    }

    // User filter
    if (from) {
      where.member = {
        profile: {
          name: {
            contains: from,
            mode: "insensitive",
          },
        },
      };
    }

    // Has filter
    if (has === "file") {
      where.fileUrl = { not: null };
    }

    // Date filters
    if (before || after) {
      where.createdAt = {};
      if (before) where.createdAt.lte = new Date(before);
      if (after) where.createdAt.gte = new Date(after);
    }

    const messages = await db.message.findMany({
      where,
      include: {
        member: {
          include: {
            profile: true,
          },
        },
        channel: {
          select: {
            id: true,
            name: true,
            serverId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.log("[SEARCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


