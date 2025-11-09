import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { serverId } = await params;

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    // Get all members currently in voice channels
    const members = await db.member.findMany({
      where: {
        serverId: serverId,
        currentChannelId: {
          not: null,
        },
      },
      include: {
        profile: true,
      },
    }).catch((err) => {
      console.error("[VOICE_MEMBERS_DB_ERROR]", err);
      return [];
    });

    // Group by channel
    const grouped = members.reduce((acc: any, member) => {
      const channelId = member.currentChannelId;
      if (!channelId) return acc;

      if (!acc[channelId]) {
        acc[channelId] = [];
      }
      acc[channelId].push(member);
      return acc;
    }, {});

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("[VOICE_MEMBERS_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

