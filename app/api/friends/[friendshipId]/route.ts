import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { friendshipId: string } }
) {
  try {
    const profile = await currentProfile();
    const { action } = await req.json(); // "accept" | "decline" | "block"

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const friendship = await db.friendship.findUnique({
      where: { id: params.friendshipId },
    });

    if (!friendship || friendship.addresseeId !== profile.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (action === "accept") {
      const updated = await db.friendship.update({
        where: { id: params.friendshipId },
        data: { status: "ACCEPTED" },
        include: {
          requester: true,
          addressee: true,
        },
      });
      return NextResponse.json(updated);
    }

    if (action === "decline") {
      await db.friendship.delete({
        where: { id: params.friendshipId },
      });
      return new NextResponse(null, { status: 204 });
    }

    if (action === "block") {
      const updated = await db.friendship.update({
        where: { id: params.friendshipId },
        data: { status: "BLOCKED" },
      });
      return NextResponse.json(updated);
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch (error) {
    console.log("[FRIENDSHIP_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { friendshipId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const friendship = await db.friendship.findUnique({
      where: { id: params.friendshipId },
    });

    if (!friendship) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (friendship.requesterId !== profile.id && friendship.addresseeId !== profile.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await db.friendship.delete({
      where: { id: params.friendshipId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[FRIENDSHIP_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


