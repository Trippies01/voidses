import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { serverId } = await params;

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
    console.log("[VOICE_MEMBERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

