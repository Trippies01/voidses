import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// Update member's voice state (join/leave channel, mute/deafen)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { memberId } = await params;
    const { currentChannelId, isMuted, isDeafened } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    // Verify this is the current user's member
    const member = await db.member.findFirst({
      where: {
        id: memberId,
        profileId: profile.id,
      },
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // Update voice state
    const updatedMember = await db.member.update({
      where: {
        id: memberId,
      },
      data: {
        currentChannelId: currentChannelId || null,
        isMuted: isMuted ?? member.isMuted,
        isDeafened: isDeafened ?? member.isDeafened,
        lastSeenAt: new Date(),
      },
      include: {
        profile: true,
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.log("[MEMBER_VOICE_STATE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

