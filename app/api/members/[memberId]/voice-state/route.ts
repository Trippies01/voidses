import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// Get member's voice state
export async function GET(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { memberId } = await params;

    if (!memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    // Get member's voice state
    const member = await db.member.findFirst({
      where: {
        id: memberId,
        profileId: profile.id,
      },
      select: {
        currentChannelId: true,
        isMuted: true,
        isDeafened: true,
      },
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("[MEMBER_VOICE_STATE_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// Update member's voice state (join/leave channel, mute/deafen)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { memberId } = await params;
    const { currentChannelId, isMuted, isDeafened } = await req.json();

    if (!memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    // Verify this is the current user's member
    const member = await db.member.findFirst({
      where: {
        id: memberId,
        profileId: profile.id,
      },
    }).catch((err) => {
      console.error("[VOICE_STATE_FIND_ERROR]", err);
      return null;
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
    }).catch((err) => {
      console.error("[VOICE_STATE_UPDATE_ERROR]", err);
      throw err;
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("[MEMBER_VOICE_STATE_PATCH]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

