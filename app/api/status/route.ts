import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const profile = await currentProfile();
    const { status, customStatus, customStatusEmoji } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updated = await db.profile.update({
      where: { id: profile.id },
      data: {
        ...(status && { status }),
        ...(customStatus !== undefined && { customStatus }),
        ...(customStatusEmoji !== undefined && { customStatusEmoji }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.log("[STATUS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


