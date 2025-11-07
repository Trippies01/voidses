import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    const messages = await db.message.findMany({
      where: {
        channelId: channelId,
        pinned: true,
        deleted: false,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        pinnedAt: "desc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.log("[PINNED_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

