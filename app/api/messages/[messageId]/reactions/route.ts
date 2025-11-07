import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { emoji } = await req.json();
    const { searchParams } = new URL(req.url);
    const { messageId } = await params;

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!messageId) {
      return new NextResponse("Message ID missing", { status: 400 });
    }

    if (!emoji) {
      return new NextResponse("Emoji missing", { status: 400 });
    }

    // Find the member
    const member = await db.member.findFirst({
      where: {
        serverId: serverId,
        profileId: profile.id,
      },
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // Check if reaction already exists
    const existingReaction = await db.messageReaction.findFirst({
      where: {
        messageId: messageId,
        memberId: member.id,
        emoji: emoji,
      },
    });

    if (existingReaction) {
      // Remove reaction (unlike)
      await db.messageReaction.delete({
        where: {
          id: existingReaction.id,
        },
      });

      return NextResponse.json({ action: "removed", reaction: existingReaction });
    } else {
      // Add reaction (like)
      const reaction = await db.messageReaction.create({
        data: {
          emoji: emoji,
          messageId: messageId,
          memberId: member.id,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });

      return NextResponse.json({ action: "added", reaction });
    }
  } catch (error) {
    console.log("[MESSAGE_REACTION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Get all reactions for a message (optional - for initial load)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { messageId } = await params;

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!messageId) {
      return new NextResponse("Message ID missing", { status: 400 });
    }

    const reactions = await db.messageReaction.findMany({
      where: {
        messageId: messageId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Group reactions by emoji
    const grouped = reactions.reduce((acc: any, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = {
          emoji: reaction.emoji,
          count: 0,
          members: [],
        };
      }
      acc[reaction.emoji].count++;
      acc[reaction.emoji].members.push(reaction.member);
      return acc;
    }, {});

    return NextResponse.json(Object.values(grouped));
  } catch (error) {
    console.log("[MESSAGE_REACTION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

