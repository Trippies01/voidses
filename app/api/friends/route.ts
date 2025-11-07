import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { addresseeId } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!addresseeId || addresseeId === profile.id) {
      return new NextResponse("Invalid addressee", { status: 400 });
    }

    // Check if friendship already exists
    const existing = await db.friendship.findFirst({
      where: {
        OR: [
          { requesterId: profile.id, addresseeId },
          { requesterId: addresseeId, addresseeId: profile.id },
        ],
      },
    });

    if (existing) {
      return new NextResponse("Friendship already exists", { status: 400 });
    }

    const friendship = await db.friendship.create({
      data: {
        requesterId: profile.id,
        addresseeId,
      },
      include: {
        requester: true,
        addressee: true,
      },
    });

    return NextResponse.json(friendship);
  } catch (error) {
    console.log("[FRIENDS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const friendships = await db.friendship.findMany({
      where: {
        OR: [
          { requesterId: profile.id, status: "ACCEPTED" },
          { addresseeId: profile.id, status: "ACCEPTED" },
        ],
      },
      include: {
        requester: true,
        addressee: true,
      },
    });

    const friends = friendships.map(f => 
      f.requesterId === profile.id ? f.addressee : f.requester
    );

    return NextResponse.json(friends);
  } catch (error) {
    console.log("[FRIENDS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


