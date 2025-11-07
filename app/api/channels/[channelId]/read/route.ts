import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// Mark channel as read
export async function POST(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { channelId } = await params;

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    // Find member
    const member = await db.member.findFirst({
      where: {
        serverId: serverId,
        profileId: profile.id,
      },
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // Get last message in channel
    const lastMessage = await db.message.findFirst({
      where: {
        channelId: channelId,
        deleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Update or create channel read status
    await db.channelRead.upsert({
      where: {
        channelId_memberId: {
          channelId: channelId,
          memberId: member.id,
        },
      },
      update: {
        lastReadMessageId: lastMessage?.id,
        lastReadAt: new Date(),
      },
      create: {
        channelId: channelId,
        memberId: member.id,
        lastReadMessageId: lastMessage?.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("[CHANNEL_READ_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Get unread count
export async function GET(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { channelId } = await params;

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    // Find member
    const member = await db.member.findFirst({
      where: {
        serverId: serverId,
        profileId: profile.id,
      },
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // Get channel read status
    const channelRead = await db.channelRead.findUnique({
      where: {
        channelId_memberId: {
          channelId: channelId,
          memberId: member.id,
        },
      },
    });

    if (!channelRead || !channelRead.lastReadMessageId) {
      // Count all messages
      const count = await db.message.count({
        where: {
          channelId: channelId,
          deleted: false,
        },
      });
      return NextResponse.json({ unreadCount: count });
    }

    // Get last read message
    const lastReadMessage = await db.message.findUnique({
      where: {
        id: channelRead.lastReadMessageId,
      },
    });

    if (!lastReadMessage) {
      const count = await db.message.count({
        where: {
          channelId: channelId,
          deleted: false,
        },
      });
      return NextResponse.json({ unreadCount: count });
    }

    // Count messages after last read
    const unreadCount = await db.message.count({
      where: {
        channelId: channelId,
        deleted: false,
        createdAt: {
          gt: lastReadMessage.createdAt,
        },
      },
    });

    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.log("[CHANNEL_READ_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

