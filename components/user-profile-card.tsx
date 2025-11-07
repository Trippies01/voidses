"use client";

import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck, MessageSquare, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useModal } from "@/hooks/use-modal-store";

interface UserProfileCardProps {
  member: Member & { profile: Profile };
  server: Server;
  currentMember: Member;
  onClose: () => void;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

const roleColorMap = {
  [MemberRole.GUEST]: "bg-zinc-500",
  [MemberRole.MODERATOR]: "bg-indigo-500",
  [MemberRole.ADMIN]: "bg-rose-500",
};

export const UserProfileCard = ({
  member,
  server,
  currentMember,
  onClose,
}: UserProfileCardProps) => {
  const router = useRouter();
  const { onOpen } = useModal();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const canManage = isAdmin || (isModerator && member.role === MemberRole.GUEST);
  const isCurrentUser = member.id === currentMember.id;

  const handleSendMessage = () => {
    router.push(`/servers/${server.id}/conversations/${member.id}`);
    onClose();
  };

  return (
    <div className="w-80 bg-[#111214] rounded-lg overflow-hidden shadow-2xl">
      {/* Banner - Gradient based on role */}
      <div
        className={`h-24 bg-gradient-to-r ${
          member.role === MemberRole.ADMIN
            ? "from-rose-500 to-pink-600"
            : member.role === MemberRole.MODERATOR
            ? "from-indigo-500 to-purple-600"
            : "from-blue-500 to-cyan-600"
        }`}
      />

      {/* Content */}
      <div className="px-4 pb-4">
        {/* Avatar - Overlaps banner */}
        <div className="-mt-12 mb-3 relative">
          <div className="w-20 h-20 rounded-full border-8 border-[#111214] overflow-hidden">
            <UserAvatar src={member.profile.imageUrl} className="w-full h-full" />
          </div>
          {/* Status indicator */}
          <div className="absolute bottom-2 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-[#111214]" />
        </div>

        {/* User Info Card */}
        <div className="bg-[#1e1f22] rounded-lg p-4 mb-3">
          <h3 className="text-xl font-bold text-white mb-1">
            {member.profile.name}
          </h3>
          <p className="text-sm text-zinc-400 mb-3 break-all">
            {member.profile.email}
          </p>

          {/* Role Badge */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                roleColorMap[member.role]
              } text-white text-sm font-semibold`}
            >
              {roleIconMap[member.role]}
              <span>
                {member.role === MemberRole.ADMIN
                  ? "Admin"
                  : member.role === MemberRole.MODERATOR
                  ? "Moderator"
                  : "Guest"}
              </span>
            </div>
          </div>
        </div>

        {/* Member Since Card */}
        <div className="bg-[#1e1f22] rounded-lg p-4 mb-3">
          <p className="text-xs text-zinc-400 uppercase font-bold mb-1">
            Üye Olma Tarihi
          </p>
          <p className="text-sm text-white">
            {format(new Date(member.createdAt), "dd MMMM yyyy", { locale: tr })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Send Message Button */}
          {!isCurrentUser && (
            <Button
              onClick={handleSendMessage}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Mesaj Gönder
            </Button>
          )}

          {/* Management Actions */}
          {canManage && !isCurrentUser && (
            <>
              <Button
                onClick={() => {
                  onOpen("members", { server });
                  onClose();
                }}
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Rol Değiştir
              </Button>

              <Button
                onClick={() => {
                  // Would open a kick modal
                  onClose();
                }}
                variant="destructive"
                className="w-full"
              >
                <ShieldAlert className="w-4 h-4 mr-2" />
                Sunucudan At
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

