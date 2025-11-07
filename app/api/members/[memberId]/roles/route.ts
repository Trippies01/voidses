import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { roleId } = await req.json();

    if (!profile || !params.memberId || !roleId) {
      return new NextResponse("Missing data", { status: 400 });
    }

    const member = await db.member.findUnique({
      where: { id: params.memberId },
      include: {
        server: {
          include: { members: true },
        },
      },
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    const requestingMember = member.server.members.find(m => m.profileId === profile.id);
    if (!requestingMember || requestingMember.role !== MemberRole.ADMIN) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedMember = await db.member.update({
      where: { id: params.memberId },
      data: {
        roleIds: {
          push: roleId,
        },
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.log("[MEMBER_ROLE_ADD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const roleId = searchParams.get("roleId");

    if (!profile || !params.memberId || !roleId) {
      return new NextResponse("Missing data", { status: 400 });
    }

    const member = await db.member.findUnique({
      where: { id: params.memberId },
      include: {
        server: { include: { members: true } },
      },
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    const requestingMember = member.server.members.find(m => m.profileId === profile.id);
    if (!requestingMember || requestingMember.role !== MemberRole.ADMIN) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedMember = await db.member.update({
      where: { id: params.memberId },
      data: {
        roleIds: member.roleIds.filter(id => id !== roleId),
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.log("[MEMBER_ROLE_REMOVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


