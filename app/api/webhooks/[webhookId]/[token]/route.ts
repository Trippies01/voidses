import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { webhookId: string; token: string } }
) {
  try {
    const { content, username, avatar_url, embeds } = await req.json();

    if (!content && (!embeds || embeds.length === 0)) {
      return new NextResponse("Content or embeds required", { status: 400 });
    }

    // Verify webhook
    const webhook = await db.webhook.findFirst({
      where: {
        id: params.webhookId,
        token: params.token,
      },
      include: {
        channel: {
          include: {
            server: {
              include: {
                members: {
                  take: 1, // Get any member for webhook usage
                },
              },
            },
          },
        },
      },
    });

    if (!webhook || !webhook.channel.server.members[0]) {
      return new NextResponse("Webhook not found", { status: 404 });
    }

    // Create message as webhook
    const message = await db.message.create({
      data: {
        content: content || "",
        channelId: webhook.channelId,
        memberId: webhook.channel.server.members[0].id, // Use first member as sender
        // TODO: Add webhook-specific fields if needed
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.log("[WEBHOOK_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


