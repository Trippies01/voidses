import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { channelId, serverId } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    // Check if the requester is admin or moderator
    const requester = await db.member.findFirst({
      where: {
        serverId: serverId,
        profileId: profile.id,
      },
    });

    if (!requester || (requester.role !== MemberRole.ADMIN && requester.role !== MemberRole.MODERATOR)) {
      return new NextResponse("Forbidden - Admin or Moderator only", { status: 403 });
    }

    // Get the target member
    const targetMember = await db.member.findUnique({
      where: {
        id: params.memberId,
      },
    });

    if (!targetMember) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // Cannot kick admins
    if (targetMember.role === MemberRole.ADMIN) {
      return new NextResponse("Cannot kick admin", { status: 403 });
    }

    // Update member's voice state to disconnect them
    await db.member.update({
      where: {
        id: params.memberId,
      },
      data: {
        currentChannelId: null,
        isMuted: false,
        isDeafened: false,
      },
    });

    return NextResponse.json({ 
      success: true,
      message: "Member kicked from voice channel" 
    });
  } catch (error) {
    console.error("[MEMBER_KICK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
