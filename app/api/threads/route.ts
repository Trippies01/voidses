import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, messageId, channelId } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || !messageId || !channelId) {
      return new NextResponse("Missing data", { status: 400 });
    }

    // Check if message exists
    const message = await db.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return new NextResponse("Message not found", { status: 404 });
    }

    // Check if thread already exists for this message
    const existingThread = await db.thread.findUnique({
      where: { starterMessageId: messageId },
    });

    if (existingThread) {
      return new NextResponse("Thread already exists", { status: 400 });
    }

    const thread = await db.thread.create({
      data: {
        name,
        starterMessageId: messageId,
        channelId,
      },
      include: {
        starterMessage: {
          include: {
            member: {
              include: {
                profile: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    return NextResponse.json(thread);
  } catch (error) {
    console.log("[THREADS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


