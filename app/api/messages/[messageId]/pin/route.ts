import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { messageId } = await params;

    const serverId = searchParams.get("serverId");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    if (!messageId) {
      return new NextResponse("Message ID missing", { status: 400 });
    }

    // Find the member and check permissions
    const member = await db.member.findFirst({
      where: {
        serverId: serverId,
        profileId: profile.id,
      },
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // Only Admin and Moderator can pin/unpin messages
    if (member.role !== MemberRole.ADMIN && member.role !== MemberRole.MODERATOR) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Get current message
    const message = await db.message.findUnique({
      where: {
        id: messageId,
        channelId: channelId,
      },
    });

    if (!message) {
      return new NextResponse("Message not found", { status: 404 });
    }

    // Toggle pin status
    const updatedMessage = await db.message.update({
      where: {
        id: messageId,
      },
      data: {
        pinned: !message.pinned,
        pinnedAt: !message.pinned ? new Date() : null,
        pinnedById: !message.pinned ? member.id : null,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.log("[MESSAGE_PIN_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

