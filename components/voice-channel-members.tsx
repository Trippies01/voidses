"use client";

import { useState } from "react";
import { Member, Profile } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { Mic, MicOff, Headphones } from "lucide-react";
import { OnlineStatus } from "@/components/online-status";
import { ParticipantContextMenu } from "@/components/voice/participant-context-menu";
import axios from "axios";
import { useRouter } from "next/navigation";

interface VoiceChannelMembersProps {
  members: (Member & { profile: Profile })[];
  channelName?: string;
  serverId?: string;
  channelId?: string;
  currentMemberRole?: string;
  currentMemberId?: string;
}

export const VoiceChannelMembers = ({ 
  members, 
  channelName,
  serverId,
  channelId,
  currentMemberRole = "GUEST",
  currentMemberId,
}: VoiceChannelMembersProps) => {
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    position: { x: number; y: number };
    member: Member & { profile: Profile };
  } | null>(null);
  const [memberVolumes, setMemberVolumes] = useState<Record<string, number>>({});
  const router = useRouter();

  if (members.length === 0) {
    return null;
  }

  const handleVolumeChange = (memberId: string, volume: number) => {
    setMemberVolumes(prev => ({ ...prev, [memberId]: volume }));
    // TODO: Implement actual volume change via LiveKit
  };

  const handleKick = async (targetMemberId: string) => {
    if (!serverId || !channelId) {
      console.warn("⚠️ Server ID or Channel ID missing");
      return;
    }
    
    try {
      const response = await axios.post(`/api/members/${targetMemberId}/kick`, {
        channelId: channelId,
        serverId: serverId,
      });

      if (response.data.success) {
        console.log("✅ User kicked successfully");
        // Refresh to update member list
        router.refresh();
      }
    } catch (error: any) {
      console.error("❌ Kick error:", error);
      const errorMsg = error.response?.data || "Kullanıcı atılamadı - Yetkiniz olmayabilir";
      alert(errorMsg);
    }
  };

  return (
    <>
      <div className="px-2 pb-2 bg-zinc-700/20 dark:bg-zinc-700/20 rounded-md mt-1">
        <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-2 px-2 pt-2">
          {channelName && `${channelName} —`} {members.length} {members.length === 1 ? "Kişi" : "Kişi"}
        </div>
        <div className="space-y-1">
          {members.map((member) => (
            <div
              key={member.id}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setContextMenu({
                  show: true,
                  position: { x: e.clientX, y: e.clientY },
                  member: member,
                });
              }}
              className="group px-2 py-1.5 rounded-md flex items-center gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition cursor-pointer"
            >
            <div className="relative">
              <UserAvatar
                src={member.profile.imageUrl}
                className="h-7 w-7"
              />
              <div className="absolute bottom-0 right-0">
                <OnlineStatus isOnline={member.isOnline} size="sm" />
              </div>
            </div>
            
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 flex-1 truncate">
              {member.profile.name}
            </p>

            <div className="flex items-center gap-1">
              {member.isDeafened ? (
                <Headphones className="w-4 h-4 text-red-500" />
              ) : member.isMuted ? (
                <MicOff className="w-4 h-4 text-red-500" />
              ) : (
                <Mic className="w-4 h-4 text-green-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Context Menu */}
    {contextMenu?.show && (
      <ParticipantContextMenu
        participantName={contextMenu.member.profile.name}
        participantId={contextMenu.member.id}
        isLocal={contextMenu.member.id === currentMemberId}
        isMuted={contextMenu.member.isMuted}
        volume={memberVolumes[contextMenu.member.id] || 100}
        isAdmin={currentMemberRole === "ADMIN" || currentMemberRole === "MODERATOR"}
        onVolumeChange={(volume) => handleVolumeChange(contextMenu.member.id, volume)}
        onMute={() => {
          // TODO: Implement mute
          setContextMenu(null);
        }}
        onMessage={() => {
          // TODO: Implement message
          setContextMenu(null);
        }}
        onCall={() => {
          // TODO: Implement call
          setContextMenu(null);
        }}
        onViewProfile={() => {
          // TODO: Implement view profile
          setContextMenu(null);
        }}
        onKick={async () => {
          await handleKick(contextMenu.member.id);
          setContextMenu(null);
        }}
        onBlock={() => {
          // TODO: Implement block
          setContextMenu(null);
        }}
        position={contextMenu.position}
        onClose={() => setContextMenu(null)}
      />
    )}
  </>
  );
};

